import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SignUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UploadInvoicesComponent } from './pages/upload-invoices/upload-invoices.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { InvoiceDetailComponent } from './pages/invoice-detail/invoice-detail.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CreateSimulationComponent } from './pages/create-simulation/create-simulation.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { NotificationComponent } from './pages/notification/notification.component';

export const routes: Routes = [
  {
    path: 'landing-page',
    component: LandingPageComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: {
          authorities: [IRoleType.user],
          name: 'Reportes',
          showInSidebar: true
        }
      },
       {
        path: 'notifications',
        component: NotificationsComponent,
        data: {
          authorities: [IRoleType.user],
          name: 'Notificaciones',
          showInSidebar: true
        }
      },
      {
        path: 'notification',
        component: NotificationComponent,
        data: {
          authorities: [IRoleType.superAdmin],
          name: 'Notificaciones',
          showInSidebar: true
        }
      },
      {
        path: 'create-simulation',
        component: CreateSimulationComponent,
        data: {
          authorities: [IRoleType.user],
          name: 'Crear Simulación',
          showInSidebar: true
        }
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        data: {
          authorities: [
            IRoleType.user
          ],
          name: 'Facturas',
          showInSidebar: true
        }
      },
      {
        path: 'upload-invoices',
        component: UploadInvoicesComponent,
        data: {
          authorities: [
            IRoleType.user
          ],
          name: 'Cargar Facturas',
          showInSidebar: true
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRoleType.superAdmin
          ],
          name: 'Usuarios',
          showInSidebar: true
        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Inicio',
          showInSidebar: true
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Profile',
          showInSidebar: false
        }
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Restablecer Contraseña',
          showInSidebar: false
        }
      },
      {
        path: 'invoice-detail/:id',
        component: InvoiceDetailComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Detalle de Factura',
          showInSidebar: false
        }
      }
    ],
  },
];
