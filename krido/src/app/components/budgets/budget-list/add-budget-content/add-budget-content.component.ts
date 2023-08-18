import {Component, EventEmitter, Output} from '@angular/core';
import {Budget} from "../../../../entities/budget.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

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

  constructor(private formBuilder: FormBuilder) {
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
      searchName: 'searchName',
      name: 'name',
      limit: 123.45
    };
    // TODO: Persist Budget
    this.onClose.emit();
  }

}
