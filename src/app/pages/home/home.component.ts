import { Component } from '@angular/core';
import { CardMenuComponent } from '../../components/card-menu/card-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardMenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public role: string = '';

  constructor(public router: Router
  ) {
    let user = localStorage.getItem('auth_user');
    if (user) {
      this.role = JSON.parse(user)?.role.name;
    }
  }
}
