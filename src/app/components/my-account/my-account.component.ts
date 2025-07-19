import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: "./my-account.component.html",
})
export class MyAccountComponent implements OnInit {
  private service = inject(AuthService);
  public userName: string = '';
  public lastname: string = '';

  constructor(public router: Router) {}

  ngOnInit() {
    this.loadUser(); 
    window.addEventListener('user-updated', () => {
    this.loadUser();
    });
  }

  loadUser() {
    const user = localStorage.getItem('auth_user');
    if (user) {
      const parse = JSON.parse(user);
      this.userName = parse.name;
      this.lastname = parse.lastname;
    }
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
