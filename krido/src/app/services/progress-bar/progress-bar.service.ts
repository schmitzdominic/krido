import { Injectable } from '@angular/core';
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  constructor() { }

  setProgressBarConfig(ngbProgressbarConfig: NgbProgressbarConfig) {
    ngbProgressbarConfig.striped = true;
    ngbProgressbarConfig.animated = true;
  }

  getProgressBarType(value: number, max: number): string {
    const progress = value / max * 100;
    if (progress >= 75) {
      return 'danger';
    } else if (progress >= 50) {
      return 'warning';
    } else {
      return 'success';
    }
  }
}
