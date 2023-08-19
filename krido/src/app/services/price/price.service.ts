import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor() { }

  convertNumberToEuro(number: number | undefined) {
    if (number) {
      return (Math.round(number * 100) / 100).toFixed(2).replaceAll('.', ',') + ' €';
    }
    return '0,00 €';
  }
}
