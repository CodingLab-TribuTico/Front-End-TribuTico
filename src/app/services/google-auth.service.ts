import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private base: string = environment.apiGoogleUrl;

  public loginWithGoogle(): void {
    window.location.href = this.base;
  }
}
