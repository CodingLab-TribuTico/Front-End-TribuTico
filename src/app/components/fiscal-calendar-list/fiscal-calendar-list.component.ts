import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { IFiscal } from '../../interfaces';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-fiscal-calendar-list',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './fiscal-calendar-list.component.html',
  styleUrl: './fiscal-calendar-list.component.scss'
})
export class FiscalCalendarListComponent {
  @Input() fiscalNotifications: IFiscal[] = [];
  @Output() callDeleteAction = new EventEmitter<IFiscal>();
  @Output() callEditAction = new EventEmitter<IFiscal>();
  @ViewChild('confirmationModal') public confirmationModal: any;
  public modalService: ModalService = inject(ModalService);
  public selectedFiscalCalendar: IFiscal | null = null;

  openModal(item: IFiscal) {
    this.selectedFiscalCalendar = item;
    this.modalService.displayModal(this.confirmationModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }

  deleteFiscalCalendar(id: IFiscal["id"]) {
    this.hideModal();
    const fiscalCalendar = this.fiscalNotifications.find(u => u.id === id);
    if (fiscalCalendar) {
      this.callDeleteAction.emit(fiscalCalendar);
    }
    this.selectedFiscalCalendar = null;
  }

  editFiscalCalendar(item: IFiscal) {
    this.callEditAction.emit(item);
  }
}
