import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor() { }

  convertNumberToEuro(number: number) {
    return (Math.round(number * 100) / 100).toFixed(2).replaceAll('.', ',') + ' €';
  }
}
