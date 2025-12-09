import { Component, EventEmitter, inject, Injector, Input, Output, runInInjectionContext } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountType} from "../../../../../shared/enums/account-type.enum";
import {Account} from "../../../../../shared/interfaces/account.model";
import {AccountService} from "../../../../services/account/account.service";
import {HelperService} from "../../../../services/helper/helper.service";
import {User} from "../../../../../shared/interfaces/user.model";
import {UserService} from "../../../../services/user/user.service";
import {DbService} from "../../../../services/db.service";
import { map } from 'rxjs/operators';

interface AccountTypeInterface {
  value: AccountType,
  label: string,
}

@Component({
    selector: 'app-add-or-edit-account-content',
    templateUrl: './add-or-edit-account-content.component.html',
    styleUrls: ['./add-or-edit-account-content.component.scss'],
    standalone: false
})
export class AddOrEditAccountContentComponent {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private helperService = inject(HelperService);
  private userService = inject(UserService);
  private dbService = inject(DbService);
  private injector = inject(Injector);


  @Input() account: (Account & { id: string }) | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  giroAccountType: AccountTypeInterface = {value: AccountType.giro, label: 'Girokonto'};
  creditCardAccountType: AccountTypeInterface = {value: AccountType.creditCard, label: 'Kreditkarte'}
  selectedAccountType: AccountTypeInterface = this.giroAccountType;
  accountTypes: AccountTypeInterface[] = [this.giroAccountType, this.creditCardAccountType];

  owners: (User & { id: string })[] = [];
  referenceAccounts: (Account & { id: string })[] = [];
  selectedOwners: (User & { id: string })[] = [];

  title: string = 'Konto erstellen';
  submitButtonText: string = 'Erstellen';

  isNameInvalid: boolean = true;
  isMonthDayInvalid: boolean = false;

  addOrEditAccountFormGroup: FormGroup = new FormGroup({
    accountType: new FormControl(''),
    name: new FormControl('', Validators.required),
    owners: new FormControl(''),
    creditDay: new FormControl(''),
    creditLastDay: new FormControl(''),
    referenceAccount: new FormControl(''),
  });

  ngOnInit() {
    this.createFormGroup();
    this.createListeners();
    this.loadOwners();
    this.loadAccounts();
    this.fillFormIfAccountIsAvailable();
  }

  private createFormGroup() {
    this.addOrEditAccountFormGroup = this.formBuilder.group(
      {
        accountType: [this.account ? this.account.accountType : this.selectedAccountType.value],
        name: [this.account ? this.account.name : '', Validators.required],
        owners: [''],
        creditDay: [this.account ? this.account.creditDay : ''],
        creditLastDay: [this.account ? this.account.creditLastDay : ''],
        referenceAccount: [this.account ? (this.account.referenceAccount as any)?.id : ''],
      }
    );
  }

  private fillFormIfAccountIsAvailable() {
    if (this.account) {
      this.isNameInvalid = false;
      this.submitButtonText = 'Ändern'
      this.selectedAccountType = this.account.accountType === AccountType.giro ? this.giroAccountType : this.creditCardAccountType;
      this.title = 'Konto editieren';
      if (this.account.owners) {
        // Cast to correct type to satisfy TypeScript
        this.selectedOwners = [...this.account.owners] as (User & { id: string })[];
      }
    }
  }

  private createListeners() {
    // Account Type
    this.addOrEditAccountFormGroup.controls['accountType'].valueChanges.subscribe(accountTypeName => {
      switch (accountTypeName) {
        case this.giroAccountType.value: {
          this.selectedAccountType = this.giroAccountType;
          break;
        }
        case this.creditCardAccountType.value: {
          this.selectedAccountType = this.creditCardAccountType;
          break;
        }
      }
    });
    // Validators
    this.addOrEditAccountFormGroup.controls['name'].valueChanges.subscribe((name: string) => {
      this.isNameInvalid = name.length <= 0;
    });
    this.addOrEditAccountFormGroup.controls['creditDay'].valueChanges.subscribe((creditDay: number) => {
      this.isMonthDayInvalid = !(creditDay > 0 && creditDay <= 31);
    });
  }

  private loadOwners() {
    this.userService.getAllUsers().pipe(
      map(users => users as (User & { id: string })[])
    ).subscribe(users => runInInjectionContext(this.injector, () => {
      const home = this.userService.home;
      // Filter out already selected owners
      this.owners = users.filter(user => user.home === home && !this.selectedOwners.some(so => so.id === user.id));
      
      if (this.owners.length > 0) {
        this.addOrEditAccountFormGroup.controls['owners'].setValue(this.owners[0].id);
      }
    }));
  }

  private loadAccounts() {
    this.accountService.getAllAccounts().pipe(
      map(accounts => accounts as (Account & { id: string })[])
    ).subscribe(accounts => runInInjectionContext(this.injector, () => {
      this.referenceAccounts = accounts;
      if (!this.account && accounts.length > 0) {
        this.addOrEditAccountFormGroup.controls['referenceAccount'].setValue(accounts[0].id);
      }
    }));
  }

  onSubmit() {
    if (this.account) {
      this.onEdit();
    } else {
      this.onAdd();
    }
  }

  onAdd() {
    this.accountService.addAccount(this.accountObject).then(() => {
      this.onClose.emit();
    });
  }

  onEdit() {
    this.accountService.updateAccount(this.accountObject, this.account!.id).then(() => {
      this.onClose.emit();
    });
  }

  get accountObject(): Account {
    const name: string = this.addOrEditAccountFormGroup.value.name;
    const creditDay: number = this.addOrEditAccountFormGroup.value.creditDay;
    const creditLastDay: boolean = this.addOrEditAccountFormGroup.value.creditLastDay;
    return {
      accountType: this.selectedAccountType.value,
      name: name,
      searchName: this.helperService.createSearchName(name),
      owners: this.selectedOwners as User[],
      creditDay: creditDay,
      creditLastDay: creditLastDay,
      referenceAccount: this.selectedReferenceAccount,
      value: 0
    }
  }

  onButtonDelete() {
    const path = `homes/${this.dbService.home}/accounts/${this.account!.id}`;
    this.dbService.delete(path).then(() => this.onClose.emit());
  }

  onButtonCancel() {
    this.onClose.emit();
  }

  onAddOwnerButtonClick(): void {
    const ownerToAdd = this.owners.find(o => o.id === this.addOrEditAccountFormGroup.value.owners);
    if (ownerToAdd && !this.selectedOwners.some(so => so.id === ownerToAdd.id)) {
      this.selectedOwners.push(ownerToAdd);
      // Reload owners to remove the selected one from the dropdown
      this.loadOwners();
    }
  }

  onRemoveOwnerButtonClick(ownerToRemove: User & { id: string }): void {
    this.selectedOwners = this.selectedOwners.filter(o => o.id !== ownerToRemove.id);
    // Reload owners to add the removed one back to the dropdown
    this.loadOwners();
  }

  get selectedReferenceAccount(): Account {
    const account = this.referenceAccounts.find(account => account.id === this.addOrEditAccountFormGroup.value.referenceAccount);
    return account ? account : this.accountService.noAccountValue;
  }

  get selectedType() {
    return this.addOrEditAccountFormGroup.controls['accountType'].value;
  }

  get isLastDay() {
    return this.addOrEditAccountFormGroup.controls['creditLastDay'].value;
  }

  protected readonly AccountType = AccountType;
}