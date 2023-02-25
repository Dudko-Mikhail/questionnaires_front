import {Injectable} from '@angular/core';

declare var window: any

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  openModal(modalId: string): void {
    const modal = document.getElementById(modalId)
    new window.bootstrap.Modal(modal).show()

  }
}
