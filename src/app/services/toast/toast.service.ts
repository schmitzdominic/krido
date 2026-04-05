import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  readonly toasts = signal<any[]>([]);

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.update(t => [...t, { textOrTpl, ...options }]);
  }

  remove(toast: any) {
    this.toasts.update(t => t.filter(x => x !== toast));
  }

  clear() {
    this.toasts.set([]);
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
