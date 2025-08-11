
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import { environment } from '../../environments/environment.development';
import { NotificationMessage } from '../interfaces';

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private client!: Client;
  private notificationSubject = new Subject<NotificationMessage>();
  private connectionStatusSubject = new Subject<boolean>();

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.client = new Client({
      brokerURL: environment.wsUrl,
      reconnectDelay: 5000,
      debug: (str) => console.log('[WebSocket]', str),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      onConnect: () => this.handleSuccessfulConnection(),
      onStompError: (frame) => this.handleError(frame),
      onWebSocketError: (event) => this.handleError(event)
    });

    this.client.activate();
  }

  private handleSuccessfulConnection(): void {
    console.log('Conexión STOMP establecida correctamente');
    this.connectionStatusSubject.next(true);
    this.subscribeToTopics();
  }

  private handleError(error: any): void {
    console.error('Error en WebSocket:', error);
    this.connectionStatusSubject.next(false);
  }

  private subscribeToTopics(): void {
    this.client.subscribe('/topic/notifications', (message) => {
      console.log('Mensaje recibido en /topic/notifications:', message.body);

      try {
        const payload = JSON.parse(message.body);
        console.log('Payload parseado:', payload);

        // Asegurar que coincida con la estructura del backend
        const notificationMessage: NotificationMessage = {
          action: payload.action,
          data: payload.data,
          id: payload.id
        };

        this.notificationSubject.next(notificationMessage);
      } catch (e) {
        console.error('Error al procesar mensaje:', e);
      }
    });

    // Mismo patrón para private-notifications
    this.client.subscribe('/user/queue/private-notifications', (message) => {
      console.log('Mensaje privado recibido:', message.body);
      // ... mismo procesamiento
    });
  }
  private processIncomingMessage(message: any): void {
    try {
      const notification = JSON.parse(message.body) as NotificationMessage;
      this.notificationSubject.next(notification);
    } catch (error) {
      console.error('Error procesando mensaje:', error);
    }
  }

  public getNotifications(): Observable<NotificationMessage> {
    return this.notificationSubject.asObservable();
  }

  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

  public disconnect(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate();
      console.log('Conexión WebSocket cerrada');
    }
  }
}
