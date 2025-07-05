import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent],
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
