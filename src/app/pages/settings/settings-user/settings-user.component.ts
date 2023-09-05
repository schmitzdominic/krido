import {Component} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import {AccountService} from "../../../services/account/account.service";
import {Account} from "../../../../shared/interfaces/account.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AccountType} from "../../../../shared/enums/account-type.enum";

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.scss']
})
export class SettingsUserComponent {

  accounts: Account[] = [];
  mainAccount: Account | undefined;

  settingsUserFormGroup: FormGroup = new FormGroup({
    mainAccount: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              public userService: UserService,) {
  }

  ngOnInit() {
    this.mainAccount = this.userService.mainAccount;
    this.createFormGroup();
    this.loadAccounts();
    this.createListeners();
  }

  createFormGroup() {
    this.settingsUserFormGroup = this.formBuilder.group(
      {
        mainAccount: ['']
      }
    );
  }

  loadAccounts() {
    this.accountService.getAllAccounts().subscribe(accounts => {
      this.accounts = [];
      accounts.forEach(accountRaw => {
        const account: Account = accountRaw.payload.val() as Account;
        account.key = accountRaw.key ? accountRaw.key : '';
        this.accounts.push(account);
      });
      this.loadMainAccount();
    });
  }

  createListeners() {
    this.settingsUserFormGroup.valueChanges.subscribe(setting => {
      const foundAccount: Account | undefined = this.accounts.find(account => account.key === setting.mainAccount);
      if (foundAccount) this.updateMainAccount(foundAccount);
      /* if (this.mainAccount && this.mainAccount.key !== setting.mainAccount) {
        if (foundAccount) this.updateMainAccount(foundAccount);
      }
      if (!this.mainAccount) {

      } */
    });
  }

  loadMainAccount() {
    if (this.accounts.length == 0) {
      const account: Account = {
        name: 'Kein Konto verfügbar',
        searchName: 'Kein Konto verfügbar',
        accountType: AccountType.creditCard,
        owners: [this.userService.user]
      }
      this.accounts.push(account);
      return;
    } else {
      this.mainAccount = this.userService.mainAccount;
      this.settingsUserFormGroup.controls['mainAccount'].setValue(this.mainAccount?.key);
    }
  }

  private updateMainAccount(account: Account) {
    this.userService.updateMainAccount(account).then(() => this.mainAccount = account);
  }

  onButtonLogout() {
    this.userService.signOut();
  }

}
