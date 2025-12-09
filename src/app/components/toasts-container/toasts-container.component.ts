import { Component, TemplateRef, inject } from '@angular/core';
import {ToastService} from "../../services/toast/toast.service";

@Component({
    selector: 'app-toasts',
    templateUrl: './toasts-container.component.html',
    styleUrls: ['./toasts-container.component.scss'],
    host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
    standalone: false
})
export class ToastsContainerComponent {
  toastService = inject(ToastService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {}

  isTemplate(toast: { textOrTpl: any; }) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
