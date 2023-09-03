import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-or-edit-entry',
  templateUrl: './add-or-edit-entry.component.html',
  styleUrls: ['./add-or-edit-entry.component.scss']
})
export class AddOrEditEntryComponent {

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  title: string = 'Ausgabe';
  submitButtonText: string = 'Speichern';

  addOrEditEntryFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {

  }

  createFormGroup() {
    this.addOrEditEntryFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
      }
    );
  }

  onSubmit() {

  }

  onButtonCancel() {
    this.onClose.emit();
  }

}
