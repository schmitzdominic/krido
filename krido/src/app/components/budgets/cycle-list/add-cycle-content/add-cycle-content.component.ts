import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Cycle} from "../../../../entities/cycle.model";
import {CycleType} from "../../../../enums/cycle-type.enum";

@Component({
  selector: 'app-add-cycle-content',
  templateUrl: './add-cycle-content.component.html',
  styleUrls: ['./add-cycle-content.component.scss']
})
export class AddCycleContentComponent {

  @Input() cycle: Cycle | undefined;

  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  title: string = 'Zyklus erstellen';
  submitButtonText: string = 'Erstellen';

  isLimitVisible: boolean = false;

  chosenCycleType: CycleType = CycleType.monthly;

  addCycleFormGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    initialLimit: new FormControl(''),
    limit: new FormControl(''),
    transfer: new FormControl(''),
    createNow: new FormControl('')
  });

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.setValidators();
  }

  createFormGroup() {
    this.addCycleFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        initialLimit: [''],
        limit: [''],
        transfer: [''],
        createNow: ['']
      }
    );
  }

  setValidators() {
    this.addCycleFormGroup.controls['initialLimit'].valueChanges.subscribe(initialLimit => {
      this.isLimitVisible = initialLimit;
    });
  }


  onSubmit() {

  }

  onCancel() {
    this.onClose.emit();
  }

}
