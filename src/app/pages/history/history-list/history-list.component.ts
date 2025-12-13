import { Component, inject, Injector, Input, runInInjectionContext, SimpleChanges, ViewChild } from '@angular/core';
import {EntryService} from "../../../services/entry/entry.service";
import {HelperService} from "../../../services/helper/helper.service";
import {Entry} from "../../../../shared/interfaces/entry.model";
import {DateService} from "../../../services/date/date.service";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Account} from "../../../../shared/interfaces/account.model";
import { map } from 'rxjs/operators';

export interface HistorySearchObject {
  searchValue: string,
  account: Account | undefined,
  isLastMonth: boolean
}

/**
 * @Component HistoryListComponent
 * Displays a list of historical entries based on search criteria.
 * It can show entries from the last month or based on a search query.
 */
@Component({
    selector: 'app-history-list',
    templateUrl: './history-list.component.html',
    styleUrls: ['./history-list.component.scss'],
    standalone: false
})
export class HistoryListComponent {
  private entryService = inject(EntryService);
  private helperService = inject(HelperService);
  private dateService = inject(DateService);
  private ngbModal = inject(NgbModal);
  private injector = inject(Injector);

  /**
   * The search object input from the parent component.
   * A setter is used to push new values to the `historySearchObject$` stream.
   */
  @Input() historySearchObject: HistorySearchObject | undefined;

  /** Reference to the modal template for adding or editing an entry. */
  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;

  /** The title displayed above the list, e.g., "Results" or "Last Month". */
  title: string = '';

  addOrEditEntryModalRef: NgbModalRef | undefined;

  entries: (Entry & { id: string })[] = [];

  /** The currently selected entry for editing. */
  selectedEntry: (Entry & { id: string }) | undefined;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    this.historySearchObject = changes['historySearchObject']?.currentValue;

    if (this.historySearchObject!.searchValue.length > 2) {
      this.search(this.historySearchObject!.searchValue, this.historySearchObject!.account);
    } else {
      if (this.historySearchObject!.isLastMonth) {
        this.loadLastMonth(this.historySearchObject!.account);
      } else {
        this.entries.length = 0;
      }
    }
  }

  search(value: string, account: Account | undefined = undefined) {
    this.title = 'Ergebnisse'
    this.entryService.searchEntriesByName(this.helperService.createSearchName(value)).pipe(
      map(results => results as (Entry & { id: string })[])
    ).subscribe(results => {
      this.entries = results.filter(entry => entry.searchName.includes(this.helperService.createSearchName(value)));

      if (this.entries.length === 0) {
        this.title = 'Nichts gefunden!'
      } else {
        if (account) {
          this.filterEntriesByAccount(account);
        }
        this.sortEntriesByDate(this.entries);
      }
    });
  }

  private sortEntriesByDate(entries: Entry[]) {
    entries.sort((one, two) => {
      return one.date > two.date ? -1 : 1;
    });
  }

  loadLastMonth(account: Account | undefined = undefined) {
    const lastMonthString: string = this.dateService.getMonthStringFromMonth(-1);
    this.title = `${this.dateService.getMonthName(lastMonthString)} ${this.dateService.getYear(lastMonthString)}`;
    this.entryService.searchEntriesByMonthString(lastMonthString).pipe(
      map(results => results as (Entry & { id: string })[])
    ).subscribe(results => runInInjectionContext(this.injector, () => {
      this.entries = results.filter(entry => entry.monthString.includes(lastMonthString));

      if (account) {
        this.filterEntriesByAccount(account);
      }
    }));
  }

  filterEntriesByAccount(account: Account) {
    this.entries = this.entries.filter(entry => (entry.account as any)?.id === (account as any)?.id);
  }

  /** Opens the modal for adding or editing an entry. */
  openAddOrEditEntryModal(): void {
    this.addOrEditEntryModalRef = this.ngbModal.open(
      this.addOrEditEntryModal,
      {
        size: 'md'
      });
  }

  /** Closes the add/edit modal and resets the selected entry. */
  onCloseAddOrEditEntryModal(): void {
    if (this.addOrEditEntryModalRef) {
      this.addOrEditEntryModalRef.close();
      this.selectedEntry = undefined;
    }
  }

  /**
   * Handles the click event on an entry list item.
   * @param entry The clicked entry.
   */
  onEntryClick(entry: Entry & { id: string }) {
    this.selectedEntry = entry;
    this.openAddOrEditEntryModal();
  }
}
