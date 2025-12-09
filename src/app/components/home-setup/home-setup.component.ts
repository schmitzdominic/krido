import { Component, inject, Injector, runInInjectionContext } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HomeService} from "../../services/home/home.service";
import {Home} from "../../../shared/interfaces/home.model";
import {ToastService} from "../../services/toast/toast.service";
import {HelperService} from "../../services/helper/helper.service";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-home-setup',
    templateUrl: './home-setup.component.html',
    styleUrls: ['./home-setup.component.scss'],
    standalone: false
})
export class HomeSetupComponent {
  private formBuilder = inject(FormBuilder);
  private homeService = inject(HomeService);
  private helperService = inject(HelperService);
  private toastService = inject(ToastService);
  private injector = inject(Injector);


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
    // With the new API, we get the array of homes directly.
    this.homeService.getAllHomes.pipe(
      map(homes => homes as Home[])
    ).subscribe(homes => this.homes = homes);
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
      if (isHomeExisting.pin === Number(pin)) {
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
        runInInjectionContext(this.injector, () => {
          this.homeService.joinHome(home).then(() => {
            window.location.reload();
            this.toastService.showSuccess(`${this.createFormGroup.value.createHomeName} erfolgreich erstellt`, 5000);
          });
        })
      });
    }
  }

}
