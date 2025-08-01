import { Component, EventEmitter, inject, Output, ViewChild } from "@angular/core";
import { NotificationService } from "../../../services/notification.service";
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { LoaderComponent } from "../../../components/loader/loader.component";
import { ModalComponent } from "../../../components/modal/modal.component";
import { ModalService } from "../../../services/modal.service";
import { NotificationFormComponent } from "../../../components/notification-form/notification-form.component";
import { FormBuilder, Validators } from "@angular/forms";
import { INotificationGlobal } from "../../../interfaces";
import { NotificationListComponent } from "../../../components/notification-detail/notification-list.component";

@Component({
  selector: "app-notification-detail",
  standalone: true,
  imports: [
    NotificationListComponent,
    PaginationComponent,
    LoaderComponent,
    ModalComponent,
    NotificationFormComponent
  ],
  templateUrl: "./notification-detail.component.html",
})
export class NotificationDetailComponent{
  public notificationService: NotificationService = inject(NotificationService);
  @Output() callCustomSearchMethod = new EventEmitter();
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addNotificationsModal') public addNotificationsModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  notificationForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['', Validators.required],
    date: ['', Validators.required],
    state: ['', Validators.required]
  })

  constructor() {
    this.notificationService.search.page = 1;
    this.notificationService.getAll();
  }
  
  saveNotification(notification: INotificationGlobal) {
    this.notificationService.saveNotification(notification);
    this.modalService.closeAll();
  }
  
  openModal() {
    this.modalService.displayModal(this.addNotificationsModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }

  search(event: Event) {
    let input = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.notificationService.search.page = 1;
    this.notificationService.search.search = input;
    this.notificationService.getAll();
  }

}