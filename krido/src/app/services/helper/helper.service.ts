import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  createSearchName(name: string): string {
    return name.replaceAll(' ', '');
  }
}
