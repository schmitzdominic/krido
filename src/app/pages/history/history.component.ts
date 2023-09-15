import { Component } from '@angular/core';
import {MenuTitleService} from "../../../shared/behavior/menu-title/menu-title.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-expenditures',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  searchValue: string = '';
  isLastMonth: boolean = false;

  searchFormGroup: FormGroup = new FormGroup({
    search: new FormControl('')
  });

  constructor(private menuTitleService: MenuTitleService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.setInitialValues();
    this.createFormGroup();
    this.createListeners();
  }

  createFormGroup(): void {
    this.searchFormGroup = this.formBuilder.group(
      {
        search: ['']
      }
    );
  }

  createListeners() {
    this.searchFormGroup.controls['search'].valueChanges.subscribe(searchValue => {
      if (searchValue.length > 3) { this.isLastMonth = false }
      this.searchValue = searchValue;
    });
  }

  onClickLastMonth() {
    this.isLastMonth = !this.isLastMonth;
  }

  /**
   * Set initial values.
   */
  setInitialValues(): void {
    this.menuTitleService.setTitle('Historie');
    this.menuTitleService.setActiveId(3);
  }
}
