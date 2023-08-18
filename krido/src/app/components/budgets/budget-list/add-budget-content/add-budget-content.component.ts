import {Component, EventEmitter, Output} from '@angular/core';
import {Budget} from "../../../../entities/budget.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BudgetService} from "../../../../services/budget/budget.service";
import {HelperService} from "../../../../services/helper/helper.service";

@Component({
  selector: 'app-add-budget-content',
  templateUrl: './add-budget-content.component.html',
  styleUrls: ['./add-budget-content.component.scss']
})
export class AddBudgetContentComponent {

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  addBudgetFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    limit: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder,
              private budgetService: BudgetService,
              private helperService: HelperService) {
  }

  ngOnInit() {
    this.addBudgetFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        limit: ['', Validators.required]
      }
    );
  }

  onCancel() {
    this.onClose.emit();
  }

  onSubmit() {
    this.persistBudgetAndCloseModal();
  }

  persistBudgetAndCloseModal() {
    const budget: Budget = {
      searchName: this.helperService.createSearchName(this.addBudgetFormGroup.value.name),
      name: this.addBudgetFormGroup.value.name,
      limit: this.addBudgetFormGroup.value.limit
    };
    this.budgetService.addBudget(budget).then(() => {
      this.onClose.emit();
    });
  }

}
