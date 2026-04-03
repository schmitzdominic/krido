import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {UserService} from "../../../services/user/user.service";
import {AccountService} from "../../../services/account/account.service";
import {Account} from "../../../../shared/interfaces/account.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AccountType} from "../../../../shared/enums/account-type.enum";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-settings-user',
    templateUrl: './settings-user.component.html',
    styleUrls: ['./settings-user.component.scss'],
    standalone: false
})
export class SettingsUserComponent {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private destroyRef = inject(DestroyRef);
  userService = inject(UserService);


  accounts: Account[] = [];
  mainAccount: Account | undefined;

  settingsUserFormGroup: FormGroup = new FormGroup({
    mainAccount: new FormControl(''),
  });

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
    this.accountService.getAllAccounts().pipe(
      map(accounts => accounts as (Account & { id: string })[]),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(accounts => {
      this.accounts = accounts;
      this.loadMainAccount();
    });
  }

  createListeners() {
    this.settingsUserFormGroup.valueChanges.subscribe(setting => {
      // The 'id' property is added by the DbService
      const foundAccount = this.accounts.find(account => (account as any).id === setting.mainAccount);
      if (foundAccount) this.updateMainAccount(foundAccount);
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
      // The 'id' property is added by the DbService
      this.settingsUserFormGroup.controls['mainAccount'].setValue((this.mainAccount as any)?.id);
    }
  }

  private updateMainAccount(account: Account) {
    this.userService.updateMainAccount(account).then(() => this.mainAccount = account);
  }

  onButtonLogout() {
    this.userService.signOut();
  }

}
