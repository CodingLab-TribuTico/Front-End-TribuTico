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
  private alertService: AlertService = inject(AlertService);

  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  };

  public totalItems: any = [];

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
        this.alertService.showAlert('error', err);
      }
    });
  }

  saveNotification(notification: INotificationGlobal) {
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

  delete(notification: INotificationGlobal) {
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
}
