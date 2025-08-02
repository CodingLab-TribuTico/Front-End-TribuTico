import { Component, inject } from '@angular/core';
import { MyAccountComponent } from "../../components/my-account/my-account.component";
import { INotification } from '../../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationBellComponent } from '../../components/notification-bell/notification-bell.component';

@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: "./notifications.component.html",
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.notifications$;

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getPending();
  }

  handleToggleDropdown(open: boolean) {
    if (open) {
      this.loadNotifications();
    }
  }

  handleMarkAsRead(notification: INotification) {
    this.notificationService.updateNotification({
      ...notification,
      state: 'read'
    });
  }

  // handleMarkAllAsRead() {
  //   const currentNotifications = this.notifications();
  //   currentNotifications.forEach(notification => {
  //     if (notification.state === 'unread') {
  //       this.handleMarkAsRead(notification);
  //     }
  //   });
  // }

  traer() {
    this.notificationService.getPending;
  }

}
