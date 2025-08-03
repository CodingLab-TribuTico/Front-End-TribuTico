import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  protected override source: string = 'users/me';
  private userSignal = signal<IUser>({});
  private userService = inject(UserService);
  private alertService: AlertService = inject(AlertService);

  get user$() {
    return this.userSignal;
  }

  getUserInfoSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        this.userSignal.set(response);
      },
      error: (error: any) => {
        this.alertService.showAlert('error', error.message);
      }
    })
  }

  updateUserInfo(user: IUser) {
    this.userService.updatePatch(user).subscribe({
      next: (response: any) => {
        this.userSignal.set(response.data);
        localStorage.setItem('auth_user', JSON.stringify(response.data));
        window.dispatchEvent(new Event('user-updated'));
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al actualizar la información del usuario');
      }
    });
  }

}
