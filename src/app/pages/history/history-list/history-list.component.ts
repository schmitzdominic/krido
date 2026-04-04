import { Component, computed, inject, input, ViewChild } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import {EntryService} from "../../../services/entry/entry.service";
import {HelperService} from "../../../services/helper/helper.service";
import {Entry} from "../../../../shared/interfaces/entry.model";
import {DateService} from "../../../services/date/date.service";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Account} from "../../../../shared/interfaces/account.model";
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface HistorySearchObject {
  searchValue: string,
  account: Account | undefined,
  isLastMonth: boolean
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

  readonly historySearchObject = input<HistorySearchObject>();

  @ViewChild('addOrEditEntryModal') addOrEditEntryModal: NgbModalRef | undefined;

  addOrEditEntryModalRef: NgbModalRef | undefined;
  selectedEntry: (Entry & { id: string }) | undefined;

  readonly entries = toSignal(
    toObservable(this.historySearchObject).pipe(
      switchMap(search => {
        if (!search) return of([] as (Entry & { id: string })[]);

        if (search.searchValue.length > 2) {
          const searchName = this.helperService.createSearchName(search.searchValue);
          return this.entryService.searchEntriesByName(searchName).pipe(
            map(results => {
              let filtered = (results as (Entry & { id: string })[])
                .filter(e => e.searchName.includes(searchName));
              if (search.account) {
                filtered = filtered.filter(e =>
                  (e.account as any)?.id === (search.account as any)?.id
                );
              }
              return filtered.sort((a, b) => a.date > b.date ? -1 : 1);
            })
          );
        }

        if (search.isLastMonth) {
          const lastMonthString = this.dateService.getMonthStringFromMonth(-1);
          return this.entryService.searchEntriesByMonthString(lastMonthString).pipe(
            map(results => {
              let filtered = (results as (Entry & { id: string })[])
                .filter(e => e.monthString.includes(lastMonthString));
              if (search.account) {
                filtered = filtered.filter(e =>
                  (e.account as any)?.id === (search.account as any)?.id
                );
              }
              return filtered;
            })
          );
        }

        return of([] as (Entry & { id: string })[]);
      })
    ),
    { initialValue: [] as (Entry & { id: string })[] }
  );

  readonly title = computed(() => {
    const search = this.historySearchObject();
    if (!search) return '';
    if (search.searchValue.length > 2) {
      return this.entries().length === 0 ? 'Nichts gefunden!' : 'Ergebnisse';
    }
    if (search.isLastMonth) {
      const lastMonthString = this.dateService.getMonthStringFromMonth(-1);
      return `${this.dateService.getMonthName(lastMonthString)} ${this.dateService.getYear(lastMonthString)}`;
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
