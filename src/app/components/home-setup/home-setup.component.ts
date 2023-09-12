import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HomeService} from "../../services/home/home.service";
import {Home} from "../../../shared/interfaces/home.model";
import {ToastService} from "../../services/toast/toast.service";
import {HelperService} from "../../services/helper/helper.service";

@Component({
  selector: 'app-home-setup',
  templateUrl: './home-setup.component.html',
  styleUrls: ['./home-setup.component.scss']
})
export class HomeSetupComponent {

  joinFormGroup: FormGroup = new FormGroup({
    joinHomeName: new FormControl(''),
    joinHomePin: new FormControl('')
  });

  createFormGroup: FormGroup = new FormGroup({
    createHomeName: new FormControl('')
  });

  eventText: string = '';

  isButtonVisible:  boolean = true;
  isButtonDisabled: boolean = true;

  homes: Home[] = [];

  constructor(private formBuilder: FormBuilder,
              private homeService: HomeService,
              private helperService: HelperService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.createFormGroups();
    this.subscribeAllHomes();
  }

  createFormGroups(): void {
    // Join Form Group
    this.joinFormGroup = this.formBuilder.group(
      {
        joinHomeName: ['', Validators.required],
        joinHomePin: ['', Validators.required]
      }
    );
    // Create Form Group
    this.createFormGroup = this.formBuilder.group(
      {
        createHomeName: ['', Validators.required]
      }
    );
  }

  subscribeAllHomes(): void {
    this.homeService.getAllHomes.subscribe(homes => {
      this.homes = [];
      homes.forEach(home => {
        this.homes.push(home.payload.val() as Home);
      })
    });
  }

  onShow(event: string): void {
    this.eventText = event;
    switch (event) {
      case 'ngb-accordion-item-0': {
        this.onOpenJoin();
        break;
      }
      case 'ngb-accordion-item-1': {
        this.onOpenCreate();
        break;
      }
      default: {
        this.onNothingSelected();
        break;
      }
    }
  }

  onOpenJoin(): void {
    this.createFormGroup.controls['createHomeName'].setValue('');
  }

  onOpenCreate(): void {
    this.joinFormGroup.controls['joinHomeName'].setValue('');
    this.joinFormGroup.controls['joinHomePin'].setValue('');
  }

  onNothingSelected(): void {
    this.createFormGroup.controls['createHomeName'].setValue('');
    this.joinFormGroup.controls['joinHomeName'].setValue('');
    this.joinFormGroup.controls['joinHomePin'].setValue('');
  }

  onJoin(): void {

    const searchName: string = this.helperService.createSearchName(this.joinFormGroup.value.joinHomeName);
    const pin: number = this.joinFormGroup.value.joinHomePin;
    const isHomeExisting: Home | undefined = this.homes.find(home => home.searchName === searchName);

    if (isHomeExisting) {
      if (isHomeExisting.pin == pin) {
        // if exist and pin is equal, join!
        const home: Home = {
          searchName: searchName,
          name: this.joinFormGroup.value.joinHomeName,
          pin: pin
        };
        this.homeService.joinHome(home).then(() => {
          window.location.reload();
          this.toastService.showSuccess(`${this.joinFormGroup.value.joinHomeName} erfolgreich beigetreten`, 5000);
        });
      } else {
        this.toastService.showDanger(`Falscher PIN`);
      }
    } else {
      this.toastService.showDanger(`${this.joinFormGroup.value.joinHomeName} existiert nicht`);
    }
  }

  onCreate(): void {

    const searchName: string = this.helperService.createSearchName(this.createFormGroup.value.createHomeName);

    if (this.homes.find(home => home.searchName === searchName)) {
      this.toastService.showDanger(`${this.createFormGroup.value.createHomeName} existiert bereits`)
    } else {
      // if not exist, create and join!
      const home: Home = {
        searchName: searchName,
        name: this.createFormGroup.value.createHomeName,
        pin: this.homeService.generatePin
      };
      this.homeService.createHome(home).then(() => {
        this.homeService.joinHome(home).then(() => {
          window.location.reload();
          this.toastService.showSuccess(`${this.createFormGroup.value.createHomeName} erfolgreich erstellt`, 5000);
        });
      });
    }
  }

}
