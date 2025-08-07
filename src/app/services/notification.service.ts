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
  private allNotificationList = signal<INotification[]>([]);
  private pendingNotificationsList = signal<INotification[]>([]);
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

  get pendingNotifications$() {
    return this.pendingNotificationsList.asReadonly();
  }

  get allNotifications$() {
    return this.allNotificationList.asReadonly();
  }

  public unreadCount = computed(() =>
    this.pendingNotificationsList().length
  )

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size, search: this.search.search }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.notificationsList.set(response.data);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', err);
      }
    });
  }

  getPending() {
    this.findAllWithParamsAndCustomSource('pending').subscribe({
      next: (response: any) => {
        this.pendingNotificationsList.set(response.data);
      }, error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al recuperar las notificaciones pendientes');
      }
    });
  }

  getAllByUserId() {
    this.findAllWithParamsAndCustomSource('all').subscribe({
      next: (response: any) => {
        const notifications = response.data.map((item: any) => ({
          ...item.notification,
          isRead: item.read
        }));
        this.allNotificationList.set(notifications);
      }, error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrio un error al recuperar las notificaciones');
      }
    })
  }

  saveNotification(notification: INotification) {
    this.add(notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert('success', response.message);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al guardar la notificación');
      }
    });
  }

  updateNotification(notification: INotification) {
    this.edit(notification.id, notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert('success', response.message);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al actualizar la notificación');
      }
    });
  }

  markNotificationRead(notificationId: number) {
    this.patchCustomSource(`read/${notificationId}`, {}).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert('success', response.message);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al actualizar la notificación');
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
        this.alertService.displayAlert('error', 'Ocurrió un error al eliminar la notificación');
      }
    });
  }


  markAllAsRead() {
    const unreadNotifications = this.notificationsList().filter(n => n.id);
    unreadNotifications.forEach(item => {
      if (item.id !== undefined) {
        this.markNotificationRead(item.id);
      }
    });
  }

}
