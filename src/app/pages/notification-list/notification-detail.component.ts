import { Component, EventEmitter, inject, Output, ViewChild } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { ModalService } from "../../services/modal.service";
import { NotificationFormComponent } from "../../components/notification-form/notification-form.component";
import { FormBuilder, Validators } from "@angular/forms";
import { INotification } from "../../interfaces";
import { NotificationListComponent } from "../../components/notification-list/notification-list.component";

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
export class NotificationDetailComponent {
  public notificationService = inject(NotificationService);
  public title: string = 'Notificaciones';
  public isEditing: boolean = false;
  @Output() callCustomSearchMethod = new EventEmitter();
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addNotificationsModal') public addNotificationsModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  notificationForm = this.fb.group({
    id: [null as number | null],
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

  saveNotification(formValue: any) {
    const notification: INotification = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
      type: formValue.type,
      closeDate: formValue.closeDate,
      state: formValue.state
    };

    if (this.isEditing && notification.id) {
      this.notificationService.updateNotification(notification);
      this.hideModal();
      this.resetForm();
      this.isEditing = false;
    } else {
      this.notificationService.saveNotification(notification);
      this.hideModal();
      this.resetForm();

    }
  }

  editNotification(notification: INotification) {
    this.notificationForm.patchValue({
      id: notification.id,
      name: notification.name,
      description: notification.description,
      type: notification.type,
      date: notification.closeDate,
      state: notification.state
    });
    this.isEditing = true;
    this.openModal();
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

  cancelForm() {
    this.hideModal();
    this.resetForm();
    this.isEditing = false;
  }

  resetForm() {
    this.notificationForm.reset({
      name: '',
      description: '',
      type: '',
      date: '',
      state: ''
    });
  }
}