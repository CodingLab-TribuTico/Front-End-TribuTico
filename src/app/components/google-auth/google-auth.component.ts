import { Component } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [],
  templateUrl: './google-auth.component.html',
})
export class GoogleAuthComponent {

  constructor(private googleAuthService: GoogleAuthService) { }

  signInWithGoogle() {
    this.googleAuthService.loginWithGoogle();
  }
}