import { inject, Injectable, signal } from '@angular/core';
import { INotificationGlobal, IResponse, ISearch } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService<IResponse<any>> {
  protected override source: string = 'notifications';
  private notificationsList = signal<INotificationGlobal[]>([]);

  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  };

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  get notifications$() {
    return this.notificationsList;
  }

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size, search: this.search.search }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.notificationsList.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  saveNotification(notification: INotificationGlobal) {
    this.add(notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al agregar la notificación', 'center', 'top', ['error-snackbar']);
      }
    });
  }

  updateNotification(notification: INotificationGlobal) {
    this.edit(notification.id, notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al actualizar la notificación', 'center', 'top', ['error-snackbar']);
      }
    });
  }

  delete(notification: INotificationGlobal) {
    this.delCustomSource(`${notification.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error eliminando la notificación', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

}
