import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INotificationGlobal } from '../../interfaces';

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-form.component.html'
})
export class NotificationFormComponent {

  public fb: FormBuilder = inject(FormBuilder);
  @Input() notificationForm!: FormGroup;
  @Input() cancelOption: boolean = false;
  @Input() isEditMode: boolean = false;
  @Output() callSaveMethod: EventEmitter<INotificationGlobal> = new EventEmitter<INotificationGlobal>();
  @Output() callUpdateMethod: EventEmitter<INotificationGlobal> = new EventEmitter<INotificationGlobal>();
  @Output() callCancelMethod: EventEmitter<void> = new EventEmitter<void>();

  notificationTypes = [
    { value: 'Informativa', label: 'Informativa' },
    { value: 'Advertencia', label: 'Advertencia' },
    { value: 'Sistema', label: 'Sistema' }
  ];

  notificationStates = [
    { value: 'Activa', label: 'Activa' },
    { value: 'Inactiva', label: 'Inactiva' },
  ];

  callSave() {
    if (this.notificationForm.invalid) {
      return;
    }

    const notification: INotificationGlobal = {
      id: this.notificationForm.controls['id']?.value,
      name: this.notificationForm.controls['name'].value,
      description: this.notificationForm.controls['description'].value,
      type: this.notificationForm.controls['type'].value,
      closeDate: this.notificationForm.controls['date'].value,
      state: this.notificationForm.controls['state'].value
    };

    if (this.isEditMode && notification.id) {
      this.callUpdateMethod.emit(notification);
    } else {
      this.callSaveMethod.emit(notification);
    }
  }

  callCancel() {
    this.callCancelMethod.emit();
  }

}
