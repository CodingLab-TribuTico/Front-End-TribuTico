import { Component } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [],
  templateUrl: './google-auth.component.html',
  styleUrl: './google-auth.component.scss'
})
export class GoogleAuthComponent {

  constructor(private googleAuthService: GoogleAuthService) { }

  signInWithGoogle() {
    this.googleAuthService.loginWithGoogle();
  }
}