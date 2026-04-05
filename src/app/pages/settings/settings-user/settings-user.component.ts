import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  userService = inject(UserService);

  mainAccount: Account | undefined;

  settingsUserFormGroup: FormGroup = new FormGroup({
    mainAccount: new FormControl(''),
  });

  private readonly _rawAccounts = toSignal(
    this.accountService.getAllAccounts().pipe(
      map(accounts => accounts as (Account & { id: string })[])
    ),
    { initialValue: [] as (Account & { id: string })[] }
  );

  readonly accounts = computed((): Account[] => {
    const raw = this._rawAccounts();
    if (raw.length === 0) {
      return [{
        name: 'Kein Konto verfügbar',
        searchName: 'Kein Konto verfügbar',
        accountType: AccountType.creditCard,
        owners: [this.userService.user]
      }];
    }
    return raw;
  });

  constructor() {
    effect(() => {
      const raw = this._rawAccounts();
      if (raw.length > 0) {
        this.mainAccount = this.userService.mainAccount;
        this.settingsUserFormGroup.controls['mainAccount'].setValue((this.mainAccount as any)?.id);
      }
    });
  }

  ngOnInit() {
    this.createFormGroup();
    this.createListeners();
  }

  createFormGroup() {
    this.settingsUserFormGroup = this.formBuilder.group(
      {
        mainAccount: ['']
      }
    );
  }

  createListeners() {
    this.settingsUserFormGroup.valueChanges.subscribe(setting => {
      const foundAccount = this._rawAccounts().find(account => (account as any).id === setting.mainAccount);
      if (foundAccount) this.updateMainAccount(foundAccount);
    });
  }

  private updateMainAccount(account: Account) {
    this.userService.updateMainAccount(account).then(() => this.mainAccount = account);
  }

  onButtonLogout() {
    this.userService.signOut();
  }

}
