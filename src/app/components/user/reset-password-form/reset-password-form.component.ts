import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { IUser } from "../../../interfaces";
import { Router } from "@angular/router";
import { AlertService } from "../../../services/alert.service";

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ]
})
export class ResetPasswordFormComponent {
  @Input() form!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callCancel: EventEmitter<void> = new EventEmitter<void>();

  public user?: IUser;
  public passwordError!: string;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  public resetPassword(event: Event) {
    event.preventDefault();

    const userId = this.user?.id!;
    const currentPassword = this.form.get('currentPassword')?.value;
    const newPassword = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (newPassword !== confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.changePassword(userId, { currentPassword, newPassword }).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert(
          'success', response?.message,
          'center',
          'top',
          ['success-snackbar']
        );
        this.router.navigateByUrl('/app/profile');
      },
      error: (err) => {
        const errorMessage = err?.message;
        this.alertService.displayAlert(
          'error',
          errorMessage,
          'center',
          'top',
          ['error-snackbar']
        );
      }
    });
  }

  cancel() {
    this.callCancel.emit();
    this.form.reset();
    this.router.navigate(["/app/profile"]);
  }

}



