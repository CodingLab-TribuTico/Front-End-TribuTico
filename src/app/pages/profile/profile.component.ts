import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { IUser } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { FormBuilder, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  public profileService = inject(ProfileService);
  @Output() cancelEdit = new EventEmitter<void>();
  public fb: FormBuilder = inject(FormBuilder);
  userForm: FormGroup;
  currentUser: IUser = {};
  userInfo: IUser = {}; 
  originalInfoUser: IUser = {};
  isEditing = false;
  birthDateError?: string | null = null;
  
  constructor() {
    this.userForm = this.fb.group({
      id: [''],
      name: ['', Validators.required], 
      lastname: ['', Validators.required],
      lastname2: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      identification: ['', Validators.required], 
      birthDate: ['', Validators.required] 
    });
    this.profileService.getUserInfoSignal();
    this.currentUser = this.profileService.user$();
    console.log("objetoo ", this.currentUser);
  }
  
  editForm() {
    this.isEditing = true;
    const user = this.currentUser ?? this.profileService.user$();
    this.userForm.patchValue({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      lastname2: user.lastname2,
      email: user.email,
      identification: user.identification,
      birthDate: user.birthDate
    });
    this.originalInfoUser = { ...user };
  }
  
  saveChanges() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return; 
    }
    const updateUser: IUser = this.userForm.value;

    this.profileService.updateUserInfo(updateUser);
    this.currentUser = { ...updateUser };
    this.isEditing = false;
    this.cancelEdit.emit();
  }

  cancelChanges() {
    this.userForm.patchValue(this.originalInfoUser);
    this.cancelEdit.emit();
    this.isEditing = false; 
  }

}