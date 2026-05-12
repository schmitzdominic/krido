import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {InvoiceSettings} from "../../../../shared/interfaces/invoice-settings.model";
import {AccountService} from "../../../services/account/account.service";
import {EntryService} from "../../../services/entry/entry.service";
import {DateService} from "../../../services/date/date.service";
import {PriceService} from "../../../services/price/price.service";
import {HelperService} from "../../../services/helper/helper.service";
import {Account} from "../../../../shared/interfaces/account.model";
import {Entry} from "../../../../shared/interfaces/entry.model";
import {forkJoin} from "rxjs";
import {map, take} from "rxjs/operators";
import {EntryType} from "../../../../shared/enums/entry-type.enum";

interface AccountWithEntries {
  account: Account & { id: string };
  entries: (Entry & { id: string })[];
  /** Whether an invoice entry already exists for this account and month. */
  isAlreadyInvoiced: boolean;
}

@Component({
    selector: 'app-invoice-list',
    templateUrl: './invoice-list.component.html',
    styleUrls: ['./invoice-list.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceListComponent implements OnInit {

  // Private injections
  private accountService = inject(AccountService);
  private entryService = inject(EntryService);
  private dateService = inject(DateService);
  private router = inject(Router);
  private ngbModal = inject(NgbModal);
  private helperService = inject(HelperService);

  // Public injections (used in template)
  changeDetectorRef = inject(ChangeDetectorRef);
  priceService = inject(PriceService);

  @Input() invoiceSettings!: InvoiceSettings;
  @Output() onBack = new EventEmitter<void>();

  /** Reference to the invoice confirmation modal template. */
  @ViewChild('invoiceModal') invoiceModal: TemplateRef<any> | undefined;

  /** Active modal reference, used to close the modal programmatically. */
  invoiceModalRef: NgbModalRef | undefined;

  /** Whether the user confirmed the month transfer checkbox in the modal. */
  transferToMonth = false;

  /** Grouped entries per beneficiary account, loaded on init. */
  accountsWithEntries: AccountWithEntries[] = [];

  /** Whether the initial data load is still in progress. */
  isLoading = true;

  /** The resolved invoice account object, loaded from `invoiceSettings.invoiceAccountKey`. */
  private invoiceAccount: (Account & { id: string }) | undefined;

  protected readonly EntryType = EntryType;

  ngOnInit(): void {
    this.loadData();
  }

  /** Returns a human-readable label for the selected invoice month. */
  get monthLabel(): string {
    const ms = this.invoiceSettings.monthString;
    if (!ms) return '';
    return `${this.dateService.getMonthName(ms)} ${this.dateService.getYear(ms)}`;
  }

  /** Returns true if at least one beneficiary account has entries. */
  get hasEntries(): boolean {
    return this.accountsWithEntries.some(a => a.entries.length > 0);
  }

  /** Returns true if all accounts with entries have already been invoiced this month. */
  get isAlreadyFullyInvoiced(): boolean {
    return this.accountsWithEntries
      .filter(a => a.entries.length > 0)
      .every(a => a.isAlreadyInvoiced);
  }

  /**
   * Returns a formatted price string for a single entry,
   * prefixed with '-' for outcome entries.
   */
  getPrice(entry: Entry): string {
    const sign = entry.type === EntryType.outcome ? '-' : '';
    return `${sign} ${this.priceService.convertNumberToEuro(entry.value)}`;
  }

  /**
   * Returns a short date label (e.g. "3. Mo") for a given timestamp.
   */
  getDateLabel(timestamp: number): string {
    const date = this.dateService.getDateFromTimestamp(timestamp);
    const day = this.dateService.getDayShortName(date.getDay());
    return `${date.getDate()}. ${day}`;
  }

  /** Navigates to the home page, replacing the current history entry. */
  navigateToHome(): void {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  /**
   * Calculates the net invoice total for a list of entries.
   * Outcome entries add to the total, income entries subtract from it.
   */
  getAccountTotal(entries: (Entry & { id: string })[]): number {
    return entries.reduce((sum, e) =>
      e.type === EntryType.outcome ? sum + e.value : sum - e.value, 0
    );
  }

  /**
   * Returns the formatted net invoice total for a list of entries.
   */
  getAccountTotalLabel(entries: (Entry & { id: string })[]): string {
    return this.priceService.convertNumberToEuro(this.getAccountTotal(entries));
  }

  /** Opens the invoice confirmation modal and resets the transfer checkbox. */
  openInvoiceModal(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.transferToMonth = false;
    this.changeDetectorRef.markForCheck();
    this.invoiceModalRef = this.ngbModal.open(this.invoiceModal, { size: 'md' });
  }

  /** Closes the invoice confirmation modal. */
  closeInvoiceModal(): void {
    if (this.invoiceModalRef) {
      this.invoiceModalRef.close();
    }
  }

  /** Executes the invoice: creates one entry per beneficiary account on the invoice account, then navigates to home. */
  onExecuteInvoice(): void {
    if (!this.invoiceAccount) return;

    const billedMonthString = this.invoiceSettings.monthString!;
    const currentMonthString = this.dateService.getActualMonthString();
    const now = Date.now();
    const invoiceAccount = this.invoiceAccount;

    const createPromises = this.accountsWithEntries
      .filter(group => group.entries.length > 0)
      .map(group => {
        const total = this.getAccountTotal(group.entries);
        const name = `Abrechnung ${this.dateService.getMonthName(billedMonthString)} ${group.account.name}`;
        const entry: Entry = {
          type: total > 0 ? EntryType.outcome : EntryType.income,
          name: name,
          searchName: this.helperService.createSearchName(name),
          value: Math.abs(total),
          date: now,
          account: invoiceAccount,
          monthString: currentMonthString,
          abrechnung: `${billedMonthString}_${group.account.id}`
        };
        return this.entryService.addEntry(entry);
      });

    Promise.all(createPromises).then(() => {
      this.closeInvoiceModal();
      this.navigateToHome();
    });
  }

  /**
   * Loads the invoice account, all beneficiary accounts, and their entries for the selected month.
   * Groups the results into `accountsWithEntries`, sorted by date ascending.
   */
  private loadData(): void {
    const monthString = this.invoiceSettings.monthString!;
    const keys = this.invoiceSettings.beneficiaryAccountKeys;
    const invoiceAccountKey = this.invoiceSettings.invoiceAccountKey;

    const invoiceAccountRequest = this.accountService.getAccountById(invoiceAccountKey).pipe(
      take(1), map(acc => ({ ...acc, id: invoiceAccountKey } as Account & { id: string }))
    );

    const beneficiaryAccountRequests = keys.map(key =>
      this.accountService.getAccountById(key).pipe(take(1), map(acc => ({ ...acc, id: key } as Account & { id: string })))
    );

    forkJoin([invoiceAccountRequest, ...beneficiaryAccountRequests]).subscribe(([invoiceAccount, ...accounts]) => {
      this.invoiceAccount = invoiceAccount;

      const entryRequests = accounts.map(account =>
        this.entryService.getAllEntriesByMonthString(monthString).pipe(
          take(1),
          map(entries => entries.filter(e => {
            const accId = (e.account as any)?.id ?? (e.account as any)?.key;
            return accId === account.id;
          }))
        )
      );

      forkJoin(entryRequests).subscribe(entriesPerAccount => {
        const groups = accounts.map((account, i) => ({
          account,
          entries: entriesPerAccount[i].sort((a, b) => a.date - b.date),
          isAlreadyInvoiced: false
        }));

        const invoiceStatusRequests = groups.map(group =>
          this.entryService.hasInvoiceEntryForAbrechnung(`${monthString}_${group.account.id}`).pipe(take(1))
        );

        forkJoin(invoiceStatusRequests).subscribe(statuses => {
          this.accountsWithEntries = groups.map((group, i) => ({
            ...group,
            isAlreadyInvoiced: statuses[i]
          }));
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        });
      });
    });
  }
}

