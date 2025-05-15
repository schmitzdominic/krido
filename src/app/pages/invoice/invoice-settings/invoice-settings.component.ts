import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Account} from "../../../../shared/interfaces/account.model";
import {AccountService} from "../../../services/account/account.service";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import {InvoiceSettings} from "../../../../shared/interfaces/invoice-settings.model";
import {InvoiceService} from "../../../services/invoice/invoice.service";
import {LoadingService} from "../../../services/loading/loading.service";

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.scss']
})
export class InvoiceSettingsComponent {

  @Output() onNext: EventEmitter<InvoiceSettings> = new EventEmitter<InvoiceSettings>();

  invoiceSettings: InvoiceSettings | undefined;

  invoiceAccount: Account | undefined;
  invoiceAccounts: Account[] = [];
  beneficiaryAccounts: Account[] = [];
  selectedBeneficiaryAccounts: Account[] = [];

  invoiceSettingsFormGroup: FormGroup = new FormGroup({
    invoiceAccounts: new FormControl(''),
    beneficiaryAccounts: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
              private loadingService: LoadingService,
              private accountService: AccountService,
              private invoiceService: InvoiceService) {
  }

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
    this.invoiceService.getInvoiceSettings().subscribe(invoiceSettingsRaw => {
      const invoiceSettings: InvoiceSettings = invoiceSettingsRaw.payload.val() as InvoiceSettings;
      if (invoiceSettings) {
        this.invoiceSettings = invoiceSettings;
        this.fillFormWithSettings(invoiceSettings);
      }
      this.loadingService.setLoading = false;
    });
  }

  private loadAccounts(): void {
    this.accountService.getAllAccountsFilteredByAccountType(AccountType.giro).subscribe(accounts => {
      this.invoiceAccounts.length = 0;
      accounts.forEach(accountRaw => {
        const account: Account = accountRaw.payload.val() as Account;
        account.key = accountRaw.key ? accountRaw.key : '';
        this.invoiceAccounts.push(account);
      });
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
    const account: Account | undefined = this.beneficiaryAccounts.find(account => account.key === key);
    if (account) {
      this.selectedBeneficiaryAccounts.push(account);
      this.removeAccountFromList(account, this.beneficiaryAccounts);
      if (this.beneficiaryAccounts.length > 0) this.selectedBeneficiaryAccount = this.beneficiaryAccounts[0];
    }
  }

  public onRemoveBeneficiaryAccountButtonClick(account: Account): void {
    this.removeAccountFromList(account, this.selectedBeneficiaryAccounts);
    this.beneficiaryAccounts.push(account);
    this.selectedBeneficiaryAccount = account;
  }

  public addListener(): void {
    this.invoiceSettingsFormGroup.controls['invoiceAccounts'].valueChanges.subscribe(key => {
      const account: Account | undefined = this.invoiceAccounts.find((account: Account) => account.key === key);
      this.beneficiaryAccounts = Object.assign([], this.invoiceAccounts);
      if (account) {
        this.removeAccountFromList(account, this.beneficiaryAccounts);
        this.selectedBeneficiaryAccounts = [];
      }
    });
  }

  private removeAccountFromList(account: Account, accounts: Account[]): void {
    const index: number = accounts.map(account => account.key).indexOf(account.key);
    if (index > -1) {
      accounts.splice(index, 1);
    }
  }

  public get selectedInvoiceAccountKey(): string {
    return this.invoiceSettingsFormGroup.value.invoiceAccounts;
  }

  private get selectedBeneficiaryAccountKey(): string {
    return this.invoiceSettingsFormGroup.value.beneficiaryAccounts;
  }

  private set selectedInvoiceAccount(key: string) {
    this.invoiceSettingsFormGroup.controls['invoiceAccounts'].setValue(key);
  }

  private set selectedBeneficiaryAccount(account: Account) {
    this.invoiceSettingsFormGroup.controls['beneficiaryAccounts'].setValue(account.key);
  }

  public onSubmit(): void {

    const selectedBeneficiaryAccountKeys: string[] = [];
    this.selectedBeneficiaryAccounts.forEach((account: Account) => selectedBeneficiaryAccountKeys.push(account.key!));

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
