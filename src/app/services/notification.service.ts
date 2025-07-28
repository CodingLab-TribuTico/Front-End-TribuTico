import { inject, Injectable } from '@angular/core';
import { INotification, IResponse } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService<IResponse<any>> {
  protected override source: string = 'notifications';
  private alertService: AlertService = inject(AlertService);

  saveNotification(notification: INotification) {
    this.add(notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al agregar la notificación', 'center', 'top', ['error-snackbar']);
      }
    });
  }

}
