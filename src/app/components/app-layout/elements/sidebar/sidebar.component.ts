import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { routes } from '../../../../app.routes';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from '../../../../services/modal.service';
import { ModalComponent } from '../../../modal/modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    ModalComponent
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @ViewChild('exitModal') public exitModal: any;
  public modalService: ModalService = inject(ModalService);
  public width: any = window.innerWidth;
  public authService = inject(AuthService);
  public permittedRoutes: Route[] = [];
  private service = inject(AuthService);
  public userName: string = '';
  public role: string = '';
  appRoutes: any;

  public iconsDictionary: Record<string, string> = {
    'Inicio': 'home',
    'Usuarios': 'group',
    'Cargar Facturas': 'add_notes',
    'Crear Simulación': 'interactive_space',
    'Facturas': 'list_alt',
    'Notificaciones': 'notifications',
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
    this.modalService.displayModal(this.exitModal);
    this.service.logout();
    this.router.navigateByUrl('/login');
    this.modalService.closeAll();
  }

  openModal() {
    this.modalService.displayModal(this.exitModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }
}
