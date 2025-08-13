
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import { environment } from '../../environments/environment.development';
import { NotificationMessage } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private alertService: AlertService = inject(AlertService);
  private client!: Client;
  private notificationSubject = new Subject<NotificationMessage>();
  private connectionStatusSubject = new Subject<boolean>();
  private userId: number | null = null;
  private isConnected = false;

  constructor() {
    this.initializeUserId();
    this.initializeConnection();
  }

  private initializeUserId(): void {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        this.userId = user.id;
      }
    } catch (error) {
      this.alertService.displayAlert('error', 'Error al obtener user ID');
    }
  }

  private initializeConnection(): void {
    this.client = new Client({
      brokerURL: environment.wsUrl,
      reconnectDelay: 5000,
      onConnect: () => this.handleSuccessfulConnection(),
      onStompError: (frame: any) => this.handleError(frame),
      onWebSocketError: (event: any) => this.handleError(event),
      onDisconnect: () => this.handleDisconnect()
    });

    this.client.activate();
  }

  private handleSuccessfulConnection(): void {
    this.isConnected = true;
    this.connectionStatusSubject.next(true);
    this.subscribeToTopics();
  }

  private handleDisconnect(): void {
    this.isConnected = false;
    this.connectionStatusSubject.next(false);
  }

  private handleError(error: any): void {
    this.connectionStatusSubject.next(false);
  }

  private subscribeToTopics(): void {
    if (!this.userId) {
      this.alertService.displayAlert('warning', 'No hay userId disponible para suscripción privada');
      return;
    }

    this.client.subscribe('/topic/notifications', (message: any) => {
      this.processMessage(message);
    });

    if (this.userId) {
      const privateDest = `/user/${this.userId}/queue/private-notifications`;
      this.client.subscribe(privateDest, (message: any) => {
        this.processMessage(message);
      });
    }

  }


  private processMessage(message: any): void {
    try {
      const payload = JSON.parse(message.body);

      const notificationMessage: NotificationMessage = {
        action: payload.action,
        data: payload.data,
        id: payload.id
      };

      this.notificationSubject.next(notificationMessage);
    } catch (e) {
      this.alertService.displayAlert('error', 'Error al procesar mensaje');
    }
  }

  public getNotifications(): Observable<NotificationMessage> {
    return this.notificationSubject.asObservable();
  }

  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

  public disconnect(): void {
    if (this.client && this.isConnected) {
      this.client.deactivate();
    }
  }
}
