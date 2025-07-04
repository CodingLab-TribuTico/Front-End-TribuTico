import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() userForm!: FormGroup;
  @Input() cancelOption: boolean = false;
  @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callCancelMethod: EventEmitter<void> = new EventEmitter<void>();

  callSave() {
    let user: IUser = {
      identification: this.userForm.controls['identification'].value,
      name: this.userForm.controls['name'].value,
      lastname: this.userForm.controls['lastname'].value,
      birthDate: this.userForm.controls['birthDate'].value,
      email: this.userForm.controls['email'].value,
      status: this.userForm.controls['status'].value,
    }

    if (this.userForm.controls['id'].value) {
      user.id = this.userForm.controls['id'].value;
    }
    if (user.id) {
      this.callUpdateMethod.emit(user);
    } else {
      this.callSaveMethod.emit(user);
    }
  }

  callCancel() {
    this.callCancelMethod.emit();
  }
}
