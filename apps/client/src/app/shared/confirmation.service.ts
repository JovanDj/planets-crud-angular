import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  readonly #modal = inject(NgbModal);

  confirm(action: 'CREATE' | 'EDIT' | 'DELETE', itemName: string) {
    const modalRef = this.#modal.open(ConfirmationDialogComponent, {
      centered: true,
      container: 'body',
    });

    switch (action) {
      case 'CREATE':
        modalRef.componentInstance.title = 'Confirm creating';
        break;
      case 'EDIT':
        modalRef.componentInstance.title = 'Confirm editing';
        break;
      case 'DELETE':
        modalRef.componentInstance.title = 'Confirm deleting';
        break;
      default:
        throw new Error('Unknown action');
    }

    modalRef.componentInstance.message = `Are you sure you want to ${action.toLocaleLowerCase()} ${itemName}?`;
    modalRef.componentInstance.confirmLabel = 'Confirm';
    modalRef.componentInstance.cancelLabel = 'Cancel';

    return modalRef.result.then((result) => !!result).catch(() => false);
  }
}
