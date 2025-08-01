import { Component, inject, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    LoaderComponent,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './modal.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() confirmAction: string = '';
  @Input() cancelAction: string = '';
  @Input() icon: string = '';
  @Input() customValidation: boolean = false;
  @Input() textCenter: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() loadingConfirmationMethod: boolean = false;
  @Input() hideConfirmAction: boolean = false;
  @Input() useCustomBackGround: boolean = false;
  @Input() customBackGround: string = '';
  @Input() hideCancelOption: boolean = false;
  @Input() hideFooter: boolean = false;
  @Output() callCancelMethod = new EventEmitter();
  @Output() callConfirmationMethod = new EventEmitter();

  public modalService: NgbModal = inject(NgbModal)

  public hide() {
    this.modalService.dismissAll();
  }

  public hideModal() {
    this.hide();
    this.callCancelMethod.emit();
  }
}
