import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  set setLoading(isLoading: boolean) {
    this.isLoading.next(isLoading);
  }
}
