import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  readonly isLoading = signal(false);

  set setLoading(isLoading: boolean) {
    this.isLoading.set(isLoading);
  }
}
