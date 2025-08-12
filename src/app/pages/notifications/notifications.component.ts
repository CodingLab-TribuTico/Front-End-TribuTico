import { Component, inject } from '@angular/core';
import { MyAccountComponent } from "../../components/my-account/my-account.component";
import { INotification } from '../../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationBellComponent } from '../../components/notification-bell/notification-bell.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: "./notifications.component.html",
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  allNotifications = this.notificationService.allNotifications$;
  selectedNotification: INotification | null = null;

  ngOnInit() {
    this.loadNotifications();
    // Escucha cambios en los parámetros de la URL
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['notification']) {
      this.selectedNotification = navigation.extras.state['notification'];
    }
  }

  // Nuevo método para seleccionar notificación por ID
  selectNotificationById(id: number) {
    const notification = this.allNotifications().find(n => n.id === id);
    if (notification) {
      this.selectedNotification = notification;
      // Si la notificación no está leída, márcala como leída
      if (!notification.isRead) {
        this.handleMarkAsRead(notification.id);
      }
    }
  }

  loadNotifications() {
    this.notificationService.getAllByUserId();
  }

  selectNotification(notification: INotification) {
    this.selectedNotification = notification;
  }

  handleToggleDropdown(open: boolean) {
    if (open) {
      this.loadNotifications();
    }
  }

  handleMarkAsRead(notificationId: number) {
    this.notificationService.markNotificationRead(notificationId);
    if (this.selectedNotification) {
      this.selectedNotification.isRead = true;
    }
  }

}
