import { computed, inject, Injectable, signal } from '@angular/core';
import { INotification, IResponse, ISearch } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';
import { filter, Subscription, take, tap } from 'rxjs';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: "root",
})
export class NotificationService extends BaseService<IResponse<any>> {
  protected override source: string = "notifications";
  private notificationsList = signal<INotification[]>([]);
  private allNotificationList = signal<INotification[]>([]);
  private pendingNotificationsList = signal<INotification[]>([]);
  private alertService: AlertService = inject(AlertService);

  private webSocketService = inject(WebSocketService);
  private wsSubscription!: Subscription;

  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  };

  public totalItems: any = [];


  constructor() {
    super();
    this.setupWebSocketListeners();
    this.checkInitialConnection();
  }



  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
    this.webSocketService.disconnect();
  }

  private checkInitialConnection(): void {
    this.webSocketService.getConnectionStatus().pipe(
      take(1),
      filter(connected => !connected),
      tap(() => this.alertService.displayAlert('warning', 'No se pudo conectar al servidor de notificaciones en tiempo real'))
    ).subscribe();
  }

  private setupWebSocketListeners(): void {
    this.wsSubscription = this.webSocketService.getNotifications().subscribe({
      next: (message) => {
        console.log('Mensaje WebSocket crudo:', message); // Agrega esto para debug
        this.handleWebSocketMessage(message);
      },
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.action) {
      case "CREATE":
        this.handleNewNotification(message.data);
        break;
      case "UPDATE":
        this.handleUpdatedNotification(message.data);
        break;
      case "DELETE":
        this.handleDeletedNotification(message.id);
        break;
      case "MARK_AS_READ":
        this.handleMarkAsRead(message.data);
        break;
      case "MARK_ALL_AS_READ":
        this.handleMarkAllAsRead();
        break;
      case "USER_NOTIFICATION":
        this.handleUserNotification(message.data);
        break;
    }
  }

  private handleNewNotification(notification: INotification): void {
    this.notificationsList.update((list) => [notification, ...list]);
    this.pendingNotificationsList.update((list) => [notification, ...list]);
    this.alertService.showAlert(
      "error",
      `Nueva notificación: ${notification.name}`
    );
  }

  private handleUpdatedNotification(notification: INotification): void {
    this.notificationsList.update((list) =>
      list.map((item) => (item.id === notification.id ? notification : item))
    );
    this.pendingNotificationsList.update((list) =>
      list.map((item) => (item.id === notification.id ? notification : item))
    );
    this.allNotificationList.update((list) =>
      list.map((item) =>
        item.id === notification.id
          ? { ...item, notification }
          : item
      )
    );
  }

  private handleDeletedNotification(id: number): void {
    this.notificationsList.update((list) =>
      list.filter((item) => item.id !== id)
    );
    this.pendingNotificationsList.update((list) =>
      list.filter((item) => item.id !== id)
    );
    this.allNotificationList.update((list) =>
      list.filter((item) => item.id !== id)
    );
  }

  private handleMarkAsRead(data: INotification): void {
    this.pendingNotificationsList.update((list) =>
      list.filter((item) => item.id !== data.id)
    );
    this.allNotificationList.update((list) =>
      list.map((item) =>
        item.id === data.id
          ? { ...item, read: true }
          : item
      )
    );
  }

  private handleMarkAllAsRead(): void {
    this.pendingNotificationsList.set([]);
    this.allNotificationList.update((list) =>
      list.map((item) => ({ ...item, read: true }))
    );
  }

  private handleUserNotification(data: INotification): void {
    if (!data.isRead) {
      this.pendingNotificationsList.update((list) => [
        data,
        ...list,
      ]);
    }
    this.allNotificationList.update((list) => {
      const existing = list.findIndex(
        (item) => item.id === data.id
      );
      if (existing >= 0) {
        return list.map((item, index) => (index === existing ? data : item));
      }
      return [data, ...list];
    });
  }

  get notifications$() {
    return this.notificationsList.asReadonly();
  }

  get pendingNotifications$() {
    return this.pendingNotificationsList.asReadonly();
  }

  get allNotifications$() {
    return this.allNotificationList.asReadonly();
  }

  public unreadCount = computed(() => this.pendingNotificationsList().length);

  getAll() {
    this.findAllWithParams({
      page: this.search.page,
      size: this.search.size,
      search: this.search.search,
    }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.notificationsList.set(response.data);
      },
      error: (err: any) => {
        this.alertService.displayAlert("error", err);
      },
    });
  }

  getPending() {
    this.findAllWithParamsAndCustomSource("pending").subscribe({
      next: (response: any) => {
        this.pendingNotificationsList.set(response.data);
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "Ocurrió un error al recuperar las notificaciones pendientes"
        );
      },
    });
  }

  getAllByUserId() {
    this.findAllWithParamsAndCustomSource("all").subscribe({
      next: (response: any) => {
        const notifications = response.data.map((item: any) => ({
          ...item.notification,
          isRead: item.read,
        }));
        this.allNotificationList.set(notifications);
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "Ocurrio un error al recuperar las notificaciones"
        );
      },
    });
  }

  saveNotification(notification: INotification) {
    this.add(notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert("success", response.message);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "Ocurrió un error al guardar la notificación"
        );
      },
    });
  }

  updateNotification(notification: INotification) {
    this.edit(notification.id, notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert("success", response.message);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "Ocurrió un error al actualizar la notificación"
        );
      },
    });
  }

  markNotificationRead(notificationId: number) {
    console.log(notificationId);
    this.patchCustomSource(`read/${notificationId}`, {}).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert("success", response.message);
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "Ocurrió un error al actualizar la notificación"
        );
      },
    });
  }

  delete(notification: INotification) {
    this.delCustomSource(`${notification.id}`).subscribe({
      next: (response: any) => {
        this.alertService.showAlert("success", response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.displayAlert(
          "error",
          "Ocurrió un error al eliminar la notificación"
        );
      },
    });
  }

  markAllAsRead() {
    this.patchCustomSource("read-all", {}).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert("success", response.message);
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "Ocurrió un error al marcar todas las notificaciones como leídas"
        );
      },
    });
  }
}
