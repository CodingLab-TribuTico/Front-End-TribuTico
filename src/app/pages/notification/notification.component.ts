import { Component, inject } from '@angular/core';
import { NotificationFormComponent } from '../../components/notification-form/notification-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NotificationFormComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  public notificationService = inject(NotificationService);

  public title: string = 'Notificaciones';
  public fb: FormBuilder = inject(FormBuilder);

  notificationForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    type: ['', Validators.required],
    date: ['', Validators.required],
    state: ['', Validators.required]
  });


  saveNotification(notification: any) {
    this.notificationService.saveNotification(notification);
  }

  updateNotification(notification: any) {
    console.log('Actualizar notificación:', notification);
  }

  cancelForm() {
    this.notificationForm.reset({
      name: '',
      description: '',
      type: '',
      date: '',
      state: ''
    });
  }
}
