import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class ProfileComponent {
  @Output() cancelEdit = new EventEmitter<void>();
  public profileService = inject(ProfileService);
  public userService = inject(UserService);
  public fb: FormBuilder = inject(FormBuilder);
  isEditing = false;

  public userForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    lastname2: [''],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    identification: ['', [Validators.required, Validators.pattern(/^(\d{9}|\d{12})$/)]],
    birthDate: ['', Validators.required]
  });

  constructor() {
    this.profileService.getUserInfoSignal();
  }

  updateUser(user: IUser) {
    this.isEditing = true;
    this.userForm.patchValue({
      id: JSON.stringify(user.id),
      name: user.name,
      lastname: user.lastname,
      lastname2: user.lastname2,
      email: user.email,
      identification: user.identification,
      birthDate: user.birthDate
    });
  }

  saveChanges(update: any) {
    const user: IUser = {

      name: update.name,
      lastname: update.lastname,
      lastname2: update.lastname2,
      email: update.email,
      identification: update.identification,
      birthDate: update.birthDate
    };

    const userToSave = this.profileService.user$();

    if (this.userForm.valid) {
      if (userToSave?.id) {
        user.id = userToSave.id;

        this.profileService.updateUserInfo(user);
        this.isEditing = false;

      } else if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        return;
      }
    }
  }

  cancelChanges() {
    this.cancelEdit.emit();
    this.isEditing = false;
    this.userForm.markAsPristine();
  }

}