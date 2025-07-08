import { Component, inject } from '@angular/core';
import { ResetPasswordFormComponent } from '../../components/user/reset-password-form/reset-password-form.component';
import { UserService } from '../../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
   standalone: true,
  imports: [
    ResetPasswordFormComponent,
    CommonModule,
    ProfileComponent
  ]
})
export class ResetPasswordComponent {
  public userService: UserService = inject(UserService);
  public fb: FormBuilder = inject(FormBuilder);
  public userForm = this.fb.group({
    id: [''],
    currentPassword: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  public authService: AuthService = inject(AuthService);
  public areActionsAvailable: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);
  
  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
    });
  }

  constructor() {
    this.userService.getAll();
  }

  updateUser(item: IUser) {
    this.userService.update(item);
    this.userForm.reset();
  }
}
