import { Component, effect, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { INotification } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss'
})
export class NotificationBellComponent {
  public dropdownOpen: boolean = false;
  @ViewChild('notificationDropdown', { static: false }) dropdownRef!: ElementRef;
  public notifications: INotification[] = [
    { id: 1, title: 'New Message', message: 'You have a new message from John.', read: false, timestamp: new Date().toISOString(), type: 'message' },
    { id: 2, title: 'System Update', message: 'Your system has been updated successfully.Your system has been updated successfullyYour system has been updated successfullyYour system has been updated successfully', read: true, timestamp: new Date().toISOString(), type: 'update' },
    { id: 3, title: 'Alert', message: 'There is an alert that requires your attention.', read: false, timestamp: new Date().toISOString(), type: 'alert' },
    { id: 4, title: 'Reminder', message: 'Don\'t forget to complete your profile.', read: false, timestamp: new Date().toISOString(), type: 'reminder' },
    { id: 5, title: 'New Comment', message: 'Someone commented on your post.', read: true, timestamp: new Date().toISOString(), type: 'comment' },
    { id: 6, title: 'Weekly Summary', message: 'Here is your weekly summary of activities.', read: true, timestamp: new Date().toISOString(), type: 'summary' },
    { id: 7, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' }
  ];

  public ringing: boolean = false;

  constructor() {

  }

  toggleNotifications() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  get unreadCount(): number {
    return this.notifications ? this.notifications.filter(n => !n.read).length : 0;
  }

  markAsRead(notification: INotification) {
    notification.read = true;
  }

  markAllAsRead() {
    this.notifications.forEach(notification => notification.read = true);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdownOpen && this.dropdownRef) {
      const clickedInside = this.dropdownRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.dropdownOpen = false;
      }
    }
  }
}
