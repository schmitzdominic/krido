import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Account} from "../../../../shared/interfaces/account.model";
import {AccountService} from "../../../services/account/account.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {InvoiceSettings} from "../../../../shared/interfaces/invoice-settings.model";
import {InvoiceService} from "../../../services/invoice/invoice.service";
import {LoadingService} from "../../../services/loading/loading.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-invoice-settings',
    templateUrl: './invoice-settings.component.html',
    styleUrls: ['./invoice-settings.component.scss'],
    standalone: false
})
export class InvoiceSettingsComponent {
  private formBuilder = inject(FormBuilder);
  private loadingService = inject(LoadingService);
  private accountService = inject(AccountService);
  private invoiceService = inject(InvoiceService);
  private destroyRef = inject(DestroyRef);


  @Output() onNext: EventEmitter<InvoiceSettings> = new EventEmitter<InvoiceSettings>();

  invoiceSettings: InvoiceSettings | undefined;

  invoiceAccount: Account | undefined;
  invoiceAccounts: (Account & { id: string })[] = [];
  beneficiaryAccounts: (Account & { id: string })[] = [];
  selectedBeneficiaryAccounts: (Account & { id: string })[] = [];

  invoiceSettingsFormGroup: FormGroup = new FormGroup({
    invoiceAccounts: new FormControl(''),
    beneficiaryAccounts: new FormControl('')
  });

  ngOnInit() {
    this.createFormGroup();
    this.loadAccounts();
    this.addListener();
  }

  private createFormGroup(): void {
    this.invoiceSettingsFormGroup = this.formBuilder.group(
      {
        invoiceAccounts: [''],
        beneficiaryAccounts: ['']
      }
    );
  }

  private loadSettings(): void {
    this.loadingService.setLoading = true;
    this.invoiceService.getInvoiceSettings().pipe(
      map(settings => settings as InvoiceSettings | null),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(invoiceSettings => {
      if (invoiceSettings) {
        this.invoiceSettings = invoiceSettings;
        this.fillFormWithSettings(invoiceSettings);
      }
      this.loadingService.setLoading = false;
    });
  }

  private loadAccounts(): void {
    this.accountService.getAllAccountsFilteredByAccountType(AccountType.giro).pipe(
      map(accounts => accounts as (Account & { id: string })[]),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(accounts => {
      this.invoiceAccounts = accounts;
      this.loadSettings();
    });
  }

  private fillFormWithSettings(invoiceSettings: InvoiceSettings) {
    if (invoiceSettings) {
      this.selectedInvoiceAccount = invoiceSettings.invoiceAccountKey;
      invoiceSettings.beneficiaryAccountKeys.forEach(key => {
        this.selectBeneficiaryAccount(key);
      });
    }
  }

  public addSelectedBeneficiaryAccount(): void {
    this.selectBeneficiaryAccount(this.selectedBeneficiaryAccountKey);
  }

  private selectBeneficiaryAccount(key: string) {
    const account = this.beneficiaryAccounts.find(acc => acc.id === key);
    if (account) {
      this.selectedBeneficiaryAccounts.push(account);
      this.removeAccountFromList(account, this.beneficiaryAccounts);
      if (this.beneficiaryAccounts.length > 0) this.selectedBeneficiaryAccount = this.beneficiaryAccounts[0];
    }
  }

  public onRemoveBeneficiaryAccountButtonClick(account: Account & { id: string }): void {
    this.removeAccountFromList(account, this.selectedBeneficiaryAccounts);
    this.beneficiaryAccounts.push(account);
    this.selectedBeneficiaryAccount = account;
  }

  public addListener(): void {
    this.invoiceSettingsFormGroup.controls['invoiceAccounts'].valueChanges.subscribe(key => {
      const account = this.invoiceAccounts.find(acc => acc.id === key);
      this.beneficiaryAccounts = Object.assign([], this.invoiceAccounts);
      if (account) {
        this.removeAccountFromList(account, this.beneficiaryAccounts);
        this.selectedBeneficiaryAccounts = [];
      }
    });
  }

  private removeAccountFromList(account: Account & { id: string }, accounts: (Account & { id: string })[]): void {
    const index: number = accounts.findIndex(acc => acc.id === account.id);
    if (index > -1) {
      accounts.splice(index, 1);
    }
  }

  public get selectedInvoiceAccountKey(): string {
    return this.invoiceSettingsFormGroup.value.invoiceAccounts;
  }

  public get selectedInvoiceAccountName(): string {
    const account = this.invoiceAccounts.find(a => a.id === this.selectedInvoiceAccountKey);
    return account ? account.name : 'Konto auswählen';
  }

  private get selectedBeneficiaryAccountKey(): string {
    return this.invoiceSettingsFormGroup.value.beneficiaryAccounts;
  }

  private set selectedInvoiceAccount(key: string) {
    this.invoiceSettingsFormGroup.controls['invoiceAccounts'].setValue(key);
  }

  private set selectedBeneficiaryAccount(account: Account) {
    this.invoiceSettingsFormGroup.controls['beneficiaryAccounts'].setValue((account as any).id);
  }

  public onSubmit(): void {

    const selectedBeneficiaryAccountKeys: string[] = [];
    this.selectedBeneficiaryAccounts.forEach(account => selectedBeneficiaryAccountKeys.push((account as any).id));

    const invoiceSettings: InvoiceSettings = {
      invoiceAccountKey: this.selectedInvoiceAccountKey,
      beneficiaryAccountKeys: selectedBeneficiaryAccountKeys
    }

    if (this.invoiceSettings) {
      // update
      this.invoiceService.updateInvoiceSettings(invoiceSettings).then(status => {this.onNext.emit(invoiceSettings);});
    } else {
      // create
      this.invoiceService.addInvoiceSettings(invoiceSettings).then(status => {this.onNext.emit(invoiceSettings);});
    }
  }

}
