import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INotification } from '../../interfaces';

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss'
})
export class NotificationFormComponent {

  public fb: FormBuilder = inject(FormBuilder);
  @Input() notificationForm!: FormGroup;
  @Input() cancelOption: boolean = false;
  @Output() callSaveMethod: EventEmitter<INotification> = new EventEmitter<INotification>();
  @Output() callUpdateMethod: EventEmitter<INotification> = new EventEmitter<INotification>();
  @Output() callCancelMethod: EventEmitter<void> = new EventEmitter<void>();

  notificationTypes = [
    { value: 'INFO', label: 'Informativa' },
    { value: 'WARNING', label: 'Advertencia' },
    { value: 'SYSTEM', label: 'Sistema' }
  ];

  notificationStates = [
    { value: 'ACTIVE', label: 'Activa' },
    { value: 'INACTIVE', label: 'Inactiva' },
  ];

  callSave() {
    const notification: any = {
      name: this.notificationForm.controls['name'].value,
      description: this.notificationForm.controls['description'].value,
      type: this.notificationForm.controls['type'].value,
      closeDate: this.notificationForm.controls['date'].value,
      state: this.notificationForm.controls['state'].value,
      id: this.notificationForm.controls['id']?.value
    };

    if (notification.id) {
      this.callUpdateMethod.emit(notification);
    } else {
      this.callSaveMethod.emit(notification);
      this.notificationForm.reset({
        name: '',
        description: '',
        type: '',
        date: '',
        state: ''
      });
    }
  }

  callCancel() {
    this.callCancelMethod.emit();
  }

}
