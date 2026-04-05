import { Component, computed, inject, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {Regularly} from "../../../../shared/interfaces/regularly.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RegularlyType} from "../../../../shared/enums/regularly-type.enum";
import {RegularlyService} from "../../../services/regularly/regularly.service";
import {RegularlyCycleType} from "../../../../shared/enums/regularly-cycle-type.enum";
import {AccountService} from "../../../services/account/account.service";
import {DateService} from "../../../services/date/date.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-regularly-list',
    templateUrl: './regularly-list.component.html',
    styleUrls: ['./regularly-list.component.scss'],
    standalone: false
})
export class RegularlyListComponent {
  private ngbModal = inject(NgbModal);
  private regularlyService = inject(RegularlyService);
  private accountService = inject(AccountService);
  private dateService = inject(DateService);


  @ViewChild('addOrEditRegularlyModal') addOrEditRegularlyModal: NgbModalRef | undefined;

  selectedRegularly: Regularly | undefined;
  addOrEditRegularlyModalRef: NgbModalRef | undefined;

  protected readonly RegularlyType = RegularlyType;

  private readonly _monthRaw = toSignal<Regularly[]>(
    this.regularlyService.getAllByCycleType(RegularlyCycleType.month).pipe(
      map(r => r as Regularly[])
    )
  );
  private readonly _quarterRaw = toSignal<Regularly[]>(
    this.regularlyService.getAllByCycleType(RegularlyCycleType.quarter).pipe(
      map(r => r as Regularly[])
    )
  );
  private readonly _yearRaw = toSignal<Regularly[]>(
    this.regularlyService.getAllByCycleType(RegularlyCycleType.year).pipe(
      map(r => r as Regularly[])
    )
  );
  private readonly _accountCount = toSignal(
    this.accountService.getAllAccounts().pipe(map(a => a.length)),
    { initialValue: 0 }
  );

  readonly monthRegularities = computed(() =>
    [...(this._monthRaw() ?? [])].sort((a, b) =>
      a.monthDay && b.monthDay ? (a.monthDay < b.monthDay ? -1 : 1) : -1
    )
  );
  readonly quarterRegularities = computed(() => this._quarterRaw() ?? []);
  readonly yearRegularities = computed(() => {
    const actualDate = new Date();
    return [...(this._yearRaw() ?? [])].sort((a, b) => {
      if (a.date && b.date) {
        const aDate = this.dateService.getDateFromTimestamp(a.date);
        const bDate = this.dateService.getDateFromTimestamp(b.date);
        aDate.setFullYear(actualDate.getFullYear());
        bDate.setFullYear(actualDate.getFullYear());
        return aDate.getTime() < bDate.getTime() ? -1 : 1;
      }
      return -1;
    });
  });

  readonly isAccountAvailable = computed(() => this._accountCount() > 0);

  readonly isLoaded = computed(() =>
    this._monthRaw() !== undefined &&
    this._quarterRaw() !== undefined &&
    this._yearRaw() !== undefined
  );

  constructor() {
  }

  onRegularlyClicked(regularly: Regularly) {
    this.selectedRegularly = regularly;
    this.openAddOrEditRegularlyModal();
  }

  openAddOrEditRegularlyModal(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.addOrEditRegularlyModalRef = this.ngbModal.open(
      this.addOrEditRegularlyModal,
      {
        size: 'md'
      });
  }

  onCloseAddOrEditRegularlyModal(): void {
    if (this.addOrEditRegularlyModalRef) {
      this.addOrEditRegularlyModalRef.close();
      this.selectedRegularly = undefined;
    }
  }

  isNoContentAvailable() {
    return this.monthRegularities().length === 0 && this.quarterRegularities().length === 0 && this.yearRegularities().length === 0;
  }
}
