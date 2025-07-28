import { Component } from '@angular/core';
import { MyAccountComponent } from "../../components/my-account/my-account.component";
import { INotification } from '../../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  public notifications: INotification[] = [
    { id: 1, title: 'New Message', message: 'You have a new message from John.', read: false, timestamp: new Date().toISOString(), type: 'message' },
    { id: 2, title: 'System Update', message: 'Your system has been updated successfully.Your system has been updated successfullyYour system has been updated successfullyYour system has been updated successfully', read: true, timestamp: new Date().toISOString(), type: 'update' },
    { id: 3, title: 'Alert', message: 'There is an alert that requires your attention.', read: false, timestamp: new Date().toISOString(), type: 'alert' },
    { id: 4, title: 'Reminder', message: 'Don\'t forget to complete your profile.', read: false, timestamp: new Date().toISOString(), type: 'reminder' },
    { id: 5, title: 'New Comment', message: 'Someone commented on your post.', read: true, timestamp: new Date().toISOString(), type: 'comment' },
    { id: 6, title: 'Weekly Summary', message: 'Here is your weekly summary of activities.', read: true, timestamp: new Date().toISOString(), type: 'summary' },
    { id: 7, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' },
    { id: 8, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' },
    { id: 9, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' },
    { id: 10, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' },
    { id: 11, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' },
    { id: 12, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' },
    { id: 13, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' },
    { id: 14, title: 'New Feature', message: 'Check out the new feature we just released!', read: false, timestamp: new Date().toISOString(), type: 'feature' },

  ];

}
