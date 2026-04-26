import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  readonly #active = inject(NgbActiveModal);

  @Input({ required: true })
  title = '';

  @Input({ required: true })
  message = '';

  @Input({ required: true })
  confirmLabel = 'Confirm';

  @Input({ required: true })
  cancelLabel = 'Cancel';

  protected onConfirmClick() {
    this.#active.close(true);
  }

  protected onCancelClick() {
    this.#active.dismiss(false);
  }
}
