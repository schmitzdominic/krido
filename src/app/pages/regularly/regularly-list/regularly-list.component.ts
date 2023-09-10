import {Component, ViewChild} from '@angular/core';
import {Regularly} from "../../../../shared/interfaces/regularly.model";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RegularlyType} from "../../../../shared/enums/regularly-type.enum";
import {RegularlyService} from "../../../services/regularly/regularly.service";
import {RegularlyCycleType} from "../../../../shared/enums/regularly-cycle-type.enum";
import {AccountService} from "../../../services/account/account.service";
import {LoadingService} from "../../../services/loading/loading.service";
import {DateService} from "../../../services/date/date.service";

@Component({
  selector: 'app-regularly-list',
  templateUrl: './regularly-list.component.html',
  styleUrls: ['./regularly-list.component.scss']
})
export class RegularlyListComponent {

  @ViewChild('addOrEditRegularlyModal') addOrEditRegularlyModal: NgbModalRef | undefined;

  selectedRegularly: Regularly | undefined;
  addOrEditRegularlyModalRef: NgbModalRef | undefined;

  monthRegularities: Regularly[] = [];
  quarterRegularities: Regularly[] = [];
  yearRegularities: Regularly[] = [];

  isAccountAvailable: boolean = false;
  isToastNoAccountShown: boolean = false;

  loadedLists: number = 0;
  endLoadingOnList: number = 3;

  protected readonly RegularlyType = RegularlyType;

  constructor(private ngbModal: NgbModal,
              private regularlyService: RegularlyService,
              private accountService: AccountService,
              private loadingService: LoadingService,
              private dateService: DateService) {
  }

  ngOnInit() {
    this.loadingService.setLoading = true;
    this.checkForAccounts();
    this.loadMonth();
    this.loadQuarter();
    this.loadYear();
  }

  private loadMonth() {
    this.loadRegularities(RegularlyCycleType.month, this.monthRegularities);
  }

  private loadQuarter() {
    this.loadRegularities(RegularlyCycleType.quarter, this.quarterRegularities);
  }

  private loadYear() {
    this.loadRegularities(RegularlyCycleType.year, this.yearRegularities);
  }

  private checkForAccounts() {
    this.accountService.getAllAccounts().subscribe(accounts => {
      this.isAccountAvailable = accounts.length > 0;
      this.isToastNoAccountShown = !this.isAccountAvailable;
    });
  }

  private sortRegularly(cycleType: RegularlyCycleType, regularities: Regularly[]) {
    switch (cycleType) {
      case RegularlyCycleType.month: {
        regularities.sort((one, two) => {
          if (one.monthDay && two.monthDay) {
            return one.monthDay < two.monthDay ? -1 : 1;
          }
          return -1;
        });
        break;
      }
      case RegularlyCycleType.quarter: {
        break;
      }
      case RegularlyCycleType.year: {
        regularities.sort((one, two) => {
          if (one.date && two.date) {
            const actualDate: Date = new Date();
            const oneDate: Date = this.dateService.getDateFromTimestamp(one.date);
            const twoDate: Date = this.dateService.getDateFromTimestamp(two.date);
            oneDate.setFullYear(actualDate.getFullYear());
            twoDate.setFullYear(actualDate.getFullYear());
            return oneDate.getTime() < twoDate.getTime() ? -1 : 1;
          }
          return -1;
        });
        break;
      }
    }
  }

  private loadRegularities(regularlyCycleType: RegularlyCycleType, list: Regularly[]) {
    this.regularlyService.getAllByCycleType(regularlyCycleType).subscribe(regularities => {
      list.length = 0;
      regularities.forEach(regularlyRaw => {
        const regularly: Regularly = regularlyRaw.payload.val() as Regularly;
        regularly.key = regularlyRaw.key ? regularlyRaw.key : '';
        list.push(regularly);
      });
      this.sortRegularly(regularlyCycleType, list);
      if (++this.loadedLists == this.endLoadingOnList) {this.loadingService.setLoading = false;}
    });
  }

  onRegularlyClicked(regularly: Regularly) {
    this.selectedRegularly = regularly;
    this.openAddOrEditRegularlyModal();
  }

  openAddOrEditRegularlyModal(): void {
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
}
