import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, ViewChild } from "@angular/core";
import { INotificationGlobal } from "../../interfaces";
import { ModalService } from "../../services/modal.service";
import { MatIconModule } from "@angular/material/icon";
import { ModalComponent } from "../modal/modal.component";

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
  @Input() notifications: INotificationGlobal[] = [];
  @Output() callDeleteAction = new EventEmitter<INotificationGlobal>();
  @Output() callEditAction = new EventEmitter<INotificationGlobal>();
  @ViewChild('confirmationModal') public confirmationModal: any;
  public modalService: ModalService = inject(ModalService);
  public selectedNotification: INotificationGlobal | null = null;

  openModal(item: INotificationGlobal) {
    this.selectedNotification = item;
    this.modalService.displayModal(this.confirmationModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }

  deleteNotification(id: INotificationGlobal["id"]) {
    this.hideModal();
    const notification = this.notifications.find(u => u.id === id);
    if (notification) {
      this.callDeleteAction.emit(notification);
    }
    this.selectedNotification = null;
  }

  editNotification(item: INotificationGlobal) {
    this.callEditAction.emit(item);
  }
}