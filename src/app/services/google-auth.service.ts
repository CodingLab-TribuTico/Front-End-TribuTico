import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoginResponse } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  
  private http: HttpClient = inject(HttpClient);

  constructor() { }


  public loginWithGoogle():void {
    window.location.href = "http://localhost:8080/auth/google";
  }


}
