import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../services/user/user.service";
import {User} from "../../../../../shared/interfaces/user.model";
import {AccountType} from "../../../../../shared/enums/account-type.enum";
import {AccountService} from "../../../../services/account/account.service";
import {Account} from "../../../../../shared/interfaces/account.model";
import {HelperService} from "../../../../services/helper/helper.service";

@Component({
  selector: 'app-add-or-edit-account-content',
  templateUrl: './add-or-edit-account-content.component.html',
  styleUrls: ['./add-or-edit-account-content.component.scss']
})
export class AddOrEditAccountContentComponent {

  @Input() account: Account | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  protected readonly AccountType = AccountType;

  title: string = 'Konto erstellen';
  submitButtonText: string = 'Erstellen';

  accountTypes: AccountType[] = [AccountType.giro, AccountType.creditCard];
  referenceAccount: Account | undefined;
  referenceAccounts: Account[] = [];
  owners: User[] = [];
  selectedOwners: User[] = [];

  isNameInvalid: boolean = true;
  isOwnerInvalid: boolean = true;
  isMonthDayInvalid: boolean = false;
  isLastDay: boolean = false;

  addOrEditAccountFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl(''),
    owners: new FormControl(''),
    creditDay: new FormControl(''),
    creditLastDay: new FormControl(''),
    referenceAccount: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private accountService: AccountService,
              private helperService: HelperService) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.loadOwners();
    this.loadReferenceAccounts();
    this.createListeners();
    this.fillFormIfAccountIsAvailable();
  }

  loadOwners() {
    const home: string = this.userService.home;
    this.userService.getAllUsers().subscribe(users => {
      this.owners = users.filter(user => (user.payload.val() as User).home === home).map(user => user.payload.val() as User);
      if (this.account) {
        this.removeAlreadySelectedOwners(this.selectedOwners, this.owners);
      }
      if (this.owners.length > 0) this.selectedOwner = this.owners[0];
    });
  }

  loadReferenceAccounts() {
    this.accountService.getAllAccountsFilteredByAccountType(AccountType.giro).subscribe(accounts => {
      this.referenceAccounts.length = 0;
      accounts.forEach(accountRaw => {
        const account: Account = accountRaw.payload.val() as Account;
        account.key = accountRaw.key ? accountRaw.key : '';
        this.referenceAccounts.push(account);
      });
    });
  }

  createListeners() {
    this.addOrEditAccountFormGroup.controls['creditLastDay'].valueChanges.subscribe(lastDay => {
      this.isLastDay = lastDay;
      if (this.isLastDay) {
        this.isMonthDayInvalid = false;
      } else {
        this.checkMonthDayValidity(this.creditDay);
      }
    });
    this.addOrEditAccountFormGroup.controls['creditDay'].valueChanges.subscribe((monthDay: number) => {
      this.checkMonthDayValidity(monthDay);
    });
  }

  createFormGroup() {
    this.addOrEditAccountFormGroup = this.formBuilder.group(
      {
        name: [this.account ? this.account.name : '', Validators.required],
        type: [this.account ? this.account.accountType : ''],
        owners: [''],
        creditDay: [this.account ? this.account.creditDay: 1],
        creditLastDay: [this.account ? this.account.creditLastDay: false],
        referenceAccount: [this.account && this.account.accountType === AccountType.creditCard ? this.account.referenceAccount!.key : '']
      }
    );
  }

  fillFormIfAccountIsAvailable() {
    if (this.account) {
      this.title = 'Konto editieren';
      this.submitButtonText = 'Ändern';

      this.selectedOwners = this.account.owners;
      this.isLastDay = this.account.creditLastDay!;
    } else {
      this.selectedType = AccountType.giro;
    }
  }

  onAddOwnerButtonClick() {
    const user: User | undefined = this.owners.find(user => user.uid === this.selectedOwnerOid);
    if (user) {
      this.selectedOwners.push(user);
      this.removeUserFromList(user, this.owners);
      if (this.owners.length > 0) this.selectedOwner = this.owners[0];
    }
  }

  onRemoveOwnerButtonClick(owner: User) {
    this.removeUserFromList(owner, this.selectedOwners);
    this.owners.push(owner);
    this.selectedOwner = owner;
  }

  onSubmit() {

    // To pretend cycle dependency, the reference Account inside the reference acount will be deleted
    const referenceAccount: Account | undefined = this.selectedReferenceAccount;
    if (referenceAccount) { delete referenceAccount['referenceAccount']; }

    const account: Account = {
      name: this.selectedName,
      searchName: this.helperService.createSearchName(this.selectedName),
      accountType: this.selectedType,
      owners: this.selectedOwners,
      value: 0,
      creditDay: this.isLastDay ? 1 : this.creditDay,
      creditLastDay: this.isLastDay,
      referenceAccount: referenceAccount
    }

    if (this.selectedType === AccountType.giro) { delete account['referenceAccount']; }

    if (this.account) {
      // on Edit
      this.accountService.updateAccount(account, this.account.key!).then(() => this.onClose.emit());
    } else {
      // on Create
      this.accountService.addAccount(account).then(() => this.onClose.emit());
    }
  }

  onCancel() {
    this.onClose.emit();
  }

  private set selectedType(accountType: AccountType) {
    this.addOrEditAccountFormGroup.controls['type'].setValue(accountType);
  }

  private set selectedOwner(user: User) {
    this.addOrEditAccountFormGroup.controls['owners'].setValue(user.uid);
  }

  public get selectedReferenceAccount(): Account | undefined {
    return this.referenceAccounts.find(account => account.key == this.addOrEditAccountFormGroup.value.referenceAccount);
  }

  private get selectedName(): string {
    return this.addOrEditAccountFormGroup.value.name;
  }

  public get selectedType(): AccountType {
    return this.addOrEditAccountFormGroup.value.type;
  }

  private get selectedOwnerOid(): string {
    return this.addOrEditAccountFormGroup.value.owners;
  }

  private get creditDay(): number {
    return this.addOrEditAccountFormGroup.value.creditDay;
  }

  private removeUserFromList(user: User, list: User[]) {
    const index: number = list.map(user => user.uid).indexOf(user.uid);
    if (index > -1) {
      list.splice(index, 1);
    }
  }

  private removeAlreadySelectedOwners(selectedOwners: User[], owners: User[]) {
    selectedOwners.forEach(selectedOwner => {
      const foundOwner = owners.find(owner => owner.uid === selectedOwner.uid);
      if (foundOwner) this.removeUserFromList(selectedOwner, owners);
    });
  }

  private checkMonthDayValidity(monthDay: number) {
    if (!this.isLastDay) {
      this.isMonthDayInvalid = !(monthDay > 0 && monthDay <= 28);
    } else {
      this.isMonthDayInvalid = false;
    }
  }
}
