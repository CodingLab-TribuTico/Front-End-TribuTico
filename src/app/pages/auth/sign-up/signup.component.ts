import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SigUpComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('cedula') cedulaModel!: NgModel;
  @ViewChild('birthDate') birthDateModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  

  public user: IUser = {};

  constructor(private router: Router, 
    private authService: AuthService
  ) {}

  public handleSignup(event: Event) {
    event.preventDefault();

    [
      this.nameModel,
      this.lastnameModel,
      this.emailModel,
      this.passwordModel,
      this.cedulaModel,
      this.birthDateModel
    ].forEach(model => {
      if (!model.valid) model.control.markAsTouched();
    });

    if (
      this.nameModel.valid &&
      this.lastnameModel.valid &&
      this.emailModel.valid &&
      this.passwordModel.valid &&
      this.cedulaModel.valid &&
      this.birthDateModel.valid
    ) {
      this.authService.signup(this.user).subscribe({
        next: () => this.validSignup = true,
        error: (err: any) => (this.signUpError = err.description),
      });
    }
  }
}
