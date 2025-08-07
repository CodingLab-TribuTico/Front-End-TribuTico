import { Component, effect, ElementRef, EventEmitter, HostListener, inject, Input, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { INotification } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: "app-notification-bell",
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink],
  templateUrl: "./notification-bell.component.html",
  styleUrl: "./notification-bell.component.scss",
})
export class NotificationBellComponent {
  private notificationService = inject(NotificationService);

  @ViewChild("notificationDropdown", { static: false })
  dropdownRef!: ElementRef;

  public dropdownOpen: boolean = false;
  public notifications = this.notificationService.pendingNotifications$;
  public unreadCount = this.notificationService.unreadCount;

  ngOnInit() {
    this.loadNotifications();
  }


  loadNotifications() {
    this.notificationService.getPending();
  }

  toggleNotifications() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.loadNotifications();
    }
  }

  markAsRead(status: any) {
    this.notificationService.markNotificationRead(status.notification.id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdownOpen && this.dropdownRef) {
      const clickedInside = this.dropdownRef.nativeElement.contains(
        event.target
      );
      if (!clickedInside) {
        this.dropdownOpen = false;
      }
    }
  }
}
