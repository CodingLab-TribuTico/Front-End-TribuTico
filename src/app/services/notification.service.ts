import { computed, inject, Injectable, signal } from '@angular/core';
import { INotification, IResponse, ISearch } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService<IResponse<any>> {
  protected override source: string = 'notifications';
  private notificationsList = signal<INotification[]>([]);
  private alertService: AlertService = inject(AlertService);

  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  };

  public totalItems: any = [];

  get notifications$() {
    return this.notificationsList.asReadonly();
  }

  public unreadCount = computed(() =>
    this.notificationsList().length
  )

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size, search: this.search.search }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.notificationsList.set(response.data);
      },
      error: (err: any) => {
        this.alertService.showAlert('error', err);
      }
    });
  }

  getPending() {
    this.findAllWithParamsAndCustomSource('pending', { page: this.search.page, size: this.search.size, search: this.search.search }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.search = { ...this.search, ...response.meta };
        this.notificationsList.set(response.data);
      }, error: (err: any) => {
        this.alertService.showAlert('error', 'Ocurrió un error al recuperar las notificaciones pendientes');
      }
    });
  }


  saveNotification(notification: INotification) {
    this.add(notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert('success', response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al guardar la notificación');
      }
    });
  }

  updateNotification(notification: INotification) {
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

  delete(notification: INotification) {
    this.delCustomSource(`${notification.id}`).subscribe({
      next: (response: any) => {
        this.alertService.showAlert('success', response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al eliminar la notificación');
      }
    });
  }

  markAsRead(notificationId: number) {
    tap({
      next: () => {
        this.notificationsList.update(notifications =>
          notifications.filter(n => n.id !== notificationId)
        );
      },
      error: (err) => this.alertService.showAlert('error', err)
    })
  }


  markAllAsRead() {
    const unreadNotifications = this.notificationsList().filter(n => n.id);
    unreadNotifications.forEach(item => {
      if (item.id !== undefined) {
        this.markAsRead(item.id);
      }
    });
  }

}
