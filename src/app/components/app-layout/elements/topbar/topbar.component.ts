import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { IUser } from '../../../../interfaces';
import { MyAccountComponent } from '../../../my-account/my-account.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MyAccountComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent implements OnInit {
  public user?: IUser;

  constructor(
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
