import {Component, EventEmitter, Output} from '@angular/core';
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
    this.setSelectedType(AccountType.giro);
  }

  loadOwners() {
    const home: string = this.userService.getHome;
    this.userService.getAllUsers().subscribe(users => {
      this.owners = users.filter(user => (user.payload.val() as User).home === home).map(user => user.payload.val() as User);
      if (this.owners.length > 0) this.setSelectedOwner(this.owners[0]);
    });
  }

  createFormGroup() {
    this.addOrEditAccountFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        type: [''],
        owners: ['']
      }
    );
  }

  onAddOwnerButtonClick() {
    const user: User | undefined = this.owners.find(user => user.uid === this.selectedOwnerOid);
    if (user) {
      this.selectedOwners.push(user);
      this.removeUserFromList(user, this.owners);
      if (this.owners.length > 0) this.setSelectedOwner(this.owners[0]);
    }
  }

  onRemoveOwnerButtonClick(owner: User) {
    this.removeUserFromList(owner, this.selectedOwners);
    this.owners.push(owner);
    this.setSelectedOwner(owner);
  }

  onSubmit() {
    const account: Account = {
      name: this.selectedName,
      searchName: this.helperService.createSearchName(this.selectedName),
      accountType: this.selectedType,
      owners: this.selectedOwners

    }
    this.accountService.addAccount(account);
    this.onClose.emit();
  }

  onCancel() {
    this.owners = [];
    this.onClose.emit();
  }

  private setSelectedType(accountType: AccountType) {
    this.addOrEditAccountFormGroup.controls['type'].setValue(accountType);
  }

  private setSelectedOwner(user: User) {
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
}
