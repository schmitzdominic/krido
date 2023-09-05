import {Injectable, TemplateRef} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  showSuccess(text: string, delay: number = 2000) {
    this.show(text, { classname: 'bg-success text-light', delay: delay })
  }

  showStandard(text: string, delay: number = 2000) {
    this.show(text, { delay: delay })
  }

  showDanger(text: string, delay: number = 10000) {
    this.show(text, { classname: 'bg-danger text-light', delay: delay })
  }
}
