import { Component, computed, inject, input, ViewChild } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import {EntryService} from "../../../services/entry/entry.service";
import {HelperService} from "../../../services/helper/helper.service";
import {Entry} from "../../../../shared/interfaces/entry.model";
import {EntryType} from "../../../../shared/enums/entry-type.enum";
import {DateService} from "../../../services/date/date.service";
import {PriceService} from "../../../services/price/price.service";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Account} from "../../../../shared/interfaces/account.model";
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface HistorySearchObject {
  searchValue: string,
  account: Account | undefined,
  selectedMonth: string | null
}

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
  public priceService = inject(PriceService);

  readonly historySearchObject = input<HistorySearchObject>();

  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;

  addOrEditEntryModalRef: NgbModalRef | undefined;
  selectedEntry: (Entry & { id: string }) | undefined;
  readonly Math = Math;

  readonly entries = toSignal(
    toObservable(this.historySearchObject).pipe(
      switchMap(search => {
        if (!search) return of([] as (Entry & { id: string })[]);

        const hasSearch = search.searchValue.length > 2;
        const hasMonth = !!search.selectedMonth;
        const hasAccount = !!search.account;

        if (!hasSearch && !hasMonth && !hasAccount) return of([] as (Entry & { id: string })[]);

        const accountId = hasAccount ? (search.account as any)?.id : null;

        let source$: ReturnType<typeof this.entryService.getAllEntriesByMonthString>;
        if (hasMonth) {
          source$ = this.entryService.getAllEntriesByMonthString(search.selectedMonth!);
        } else if (hasAccount && !hasSearch) {
          source$ = this.entryService.getAllEntries();
        } else {
          source$ = this.entryService.searchEntriesByName(this.helperService.createSearchName(search.searchValue));
        }

        return source$.pipe(
          map(results => {
            let filtered = results as (Entry & { id: string })[];

            if (hasSearch) {
              const searchName = this.helperService.createSearchName(search.searchValue);
              filtered = filtered.filter(e => e.searchName.includes(searchName));
            }
            if (hasAccount) {
              filtered = filtered.filter(e =>
                (e.account as any)?.id === accountId || (e.account as any)?.key === accountId
              );
            }
            return filtered.sort((a, b) => a.date > b.date ? -1 : 1);
          })
        );
      })
    ),
    { initialValue: [] as (Entry & { id: string })[] }
  );

  /** The net total of all displayed entries (income - outcome). */
  readonly totalAmount = computed(() => {
    return this.entries().reduce((sum, entry) => {
      return entry.type === EntryType.income ? sum + entry.value : sum - entry.value;
    }, 0);
  });

  readonly title = computed(() => {
    const search = this.historySearchObject();
    if (!search) return '';
    if (search.searchValue.length > 2) {
      return this.entries().length === 0 ? 'Nichts gefunden!' : 'Ergebnisse';
    }
    if (search.selectedMonth) {
      return `${this.dateService.getMonthName(search.selectedMonth)} ${this.dateService.getYear(search.selectedMonth)}`;
    }
    return '';
  });

  openAddOrEditEntryModal(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.addOrEditEntryModalRef = this.ngbModal.open(
      this.addOrEditEntryModal,
      { size: 'md' });
  }

  onCloseAddOrEditEntryModal(): void {
    if (this.addOrEditEntryModalRef) {
      this.addOrEditEntryModalRef.close();
      this.selectedEntry = undefined;
    }
  }

  onEntryClick(entry: Entry & { id: string }) {
    this.selectedEntry = entry;
    this.openAddOrEditEntryModal();
  }
}
