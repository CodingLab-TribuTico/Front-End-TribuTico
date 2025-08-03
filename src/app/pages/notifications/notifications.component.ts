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

  allNotifications = this.notificationService.allNotifications$;
  selectedNotification: INotification | null = null;

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getAllByUserId();
  }

  selectNotification(notification: INotification){
      this.selectedNotification = notification;
  }

  handleToggleDropdown(open: boolean) {
    if (open) {
      this.loadNotifications();
    }
  }

  handleMarkAsRead(notificationId: number) {
    this.notificationService.markNotificationRead(notificationId);
    this.loadNotifications();
  }

  

  // handleMarkAllAsRead() {
  //   const currentNotifications = this.notifications();
  //   currentNotifications.forEach(notification => {
  //     if (notification.state === 'unread') {
  //       this.handleMarkAsRead(notification);
  //     }
  //   });
  // }

  traer(selectedNotification: INotification) {
    console.log('Prueba', selectedNotification.isRead);
  }

}
