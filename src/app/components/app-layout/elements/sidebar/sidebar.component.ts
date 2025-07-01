import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { routes } from '../../../../app.routes';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  public width: any = window.innerWidth;
  public authService = inject(AuthService);
  public permittedRoutes: Route[] = [];
  private service = inject(AuthService);
  public userName: string = '';
  public role: string = '';
  appRoutes: any;

  public iconsDictionary: Record<string, string> = {
    'Inicio': 'home',
    'Usuarios': 'group'
  }

  constructor(public router: Router
  ) {
    this.appRoutes = routes.filter(route => route.path == 'app')[0];
    this.permittedRoutes = this.authService.getPermittedRoutes(this.appRoutes.children);

    let user = localStorage.getItem('auth_user');
    if (user) {
      this.userName = JSON.parse(user)?.name;
      this.role = JSON.parse(user)?.role.name;
    }
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
