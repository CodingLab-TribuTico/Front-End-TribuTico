import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { GoogleAuthComponent } from '../../../components/google-auth/google-auth.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GoogleAuthComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginError!: string;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const expiresIn = params['expires_in'];
      const email = params['email'];

      if (token && expiresIn) {
        this.authService.setOAuthLogin(token, expiresIn,email);
      }
      
    });
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
        next: () => this.router.navigateByUrl('/app/home'),
        error: (err: any) => (this.loginError = err.error.description),
      });
    }
  }
}
