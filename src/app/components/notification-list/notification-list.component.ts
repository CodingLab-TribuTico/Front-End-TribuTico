import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, ViewChild } from "@angular/core";
import { ModalService } from "../../services/modal.service";
import { MatIconModule } from "@angular/material/icon";
import { ModalComponent } from "../modal/modal.component";
import { INotification } from "../../interfaces";

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ModalComponent
  ],
  templateUrl: './notification-list.component.html'
})
export class NotificationListComponent {
  @Input() notifications: INotification[] = [];
  @Output() callDeleteAction = new EventEmitter<INotification>();
  @Output() callEditAction = new EventEmitter<INotification>();
  @ViewChild('confirmationModal') public confirmationModal: any;
  public modalService: ModalService = inject(ModalService);
  public selectedNotification: INotification | null = null;

  openModal(item: INotification) {
    this.selectedNotification = item;
    this.modalService.displayModal(this.confirmationModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }

  deleteNotification(id: INotification["id"]) {
    this.hideModal();
    const notification = this.notifications.find(u => u.id === id);
    if (notification) {
      this.callDeleteAction.emit(notification);
    }
    this.selectedNotification = null;
  }

  editNotification(item: INotification) {
    this.callEditAction.emit(item);
  }
}