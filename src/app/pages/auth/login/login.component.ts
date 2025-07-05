import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalService } from '../../../services/modal.service';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginError!: string;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('expiredTokenModal') public expiredTokenModal: any;
  @ViewChild('blockedUserModal') public blockedUserModal: any;
  public modalService: ModalService = inject(ModalService);
  private previousEmail: string = '';
  private actualEmail: string = '';
  private numberOfAttempts: number = 0;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.tokenIsExpired) {
      setTimeout(() => {
        this.openModal();
      });
    }
  }

  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {

      this.authService.login(this.loginForm).subscribe({
        next: () => {
          if (this.authService.userStatus) {
            this.router.navigateByUrl('/app/home');
          } else {
            this.modalService.displayModal(this.blockedUserModal);
            this.authService.logout();
          }
        },
        error: (err: any) => {
          if (err.status === 401) {
            this.actualEmail = this.loginForm.email;
            if (this.previousEmail === this.actualEmail) {
              this.numberOfAttempts++;
            } else {
              this.numberOfAttempts = 1;
            }

            if (this.numberOfAttempts >= 3) {
              this.authService.blockUser({ email: this.actualEmail }).subscribe({
                next: () => {
                  this.modalService.displayModal(this.blockedUserModal);
                },
                error: (err: any) => {
                  this.loginError = err.description;
                  return;
                }
              });
            }

            this.previousEmail = this.actualEmail;
          }

          this.loginError = err.description;
        },
      });
    }
  }

  openModal() {
    this.modalService.displayModal(this.expiredTokenModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }
}
