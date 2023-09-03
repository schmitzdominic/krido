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

  title: string = 'Konto erstellen';
  submitButtonText: string = 'Erstellen';

  accountTypes: AccountType[] = [AccountType.giro, AccountType.creditCard];
  owners: User[] = [];
  selectedOwners: User[] = [];

  isNameInvalid: boolean = true;
  isOwnerInvalid: boolean = true;

  addOrEditAccountFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl(''),
    owners: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private accountService: AccountService,
              private helperService: HelperService) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.loadOwners();
    this.fillFormIfAccountIsAvailable();
  }

  loadOwners() {
    const home: string = this.userService.getHome;
    this.userService.getAllUsers().subscribe(users => {
      this.owners = users.filter(user => (user.payload.val() as User).home === home).map(user => user.payload.val() as User);
      if (this.account) {
        this.removeAlreadySelectedOwners(this.selectedOwners, this.owners);
      }
      if (this.owners.length > 0) this.selectedOwner = this.owners[0];
    });
  }

  createFormGroup() {
    this.addOrEditAccountFormGroup = this.formBuilder.group(
      {
        name: [this.account ? this.account.name : '', Validators.required],
        type: [this.account ? this.account.accountType : ''],
        owners: ['']
      }
    );
  }

  fillFormIfAccountIsAvailable() {
    if (this.account) {
      this.title = 'Konto editieren';
      this.submitButtonText = 'Ändern';

      this.selectedOwners = this.account.owners;
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
    const account: Account = {
      name: this.selectedName,
      searchName: this.helperService.createSearchName(this.selectedName),
      accountType: this.selectedType,
      owners: this.selectedOwners,
      value: 0
    }
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

  private get selectedName(): string {
    return this.addOrEditAccountFormGroup.value.name;
  }

  private get selectedType(): AccountType {
    return this.addOrEditAccountFormGroup.value.type;
  }

  private get selectedOwnerOid(): string {
    return this.addOrEditAccountFormGroup.value.owners;
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
}
