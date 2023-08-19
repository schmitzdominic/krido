import {Component} from '@angular/core';
import {DateService} from "../../services/date/date.service";
import {MenuTitleService} from "../../behavior/menu-title/menu-title.service";
import {DbService} from "../../services/db.service";

@Component({
  selector: 'app-actual-month',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  actualMonth = this.dateService.getActualMonthName();
  actualYear = this.dateService.getActualYear();

  constructor(private menuTitleService: MenuTitleService,
              private dateService: DateService,
              private dbService: DbService) {
  }
  ngOnInit(): void {
    this.setInitialValues();
    this.loadListOfEntries();
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle(this.actualMonth + ' ' + this.actualYear);
    this.menuTitleService.setActiveId(1);
  }

  loadListOfEntries(): void {
    this.dbService.readList('/list/entries').subscribe(entries => {
      entries.forEach(entry => {
        const object = entry.payload.val();
        //@ts-ignore
        this.entries.push(new Entry(object.name, object.price))
        console.log(entry.key, entry.payload.val());
      });
    });
  }

  addListOfEntries(): void {
    /* const elementsToPass: Entry[] = [];
    for (let i = 0; i < 50; i++) {
      elementsToPass.push(new Entry('' + i, i));
    } */
    // this.dbService.updateList('/list', 'entries', elementsToPass);
  }

  test(): void {
    console.log('TEST');
  }
}
