import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { IResponse } from '../interfaces';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: "root",
})
export class WebSocketService extends BaseService<IResponse<any>> {

  private socket$: WebSocketSubject<any>;


  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket('ws://localhost:8080/ws');
    }
  }

  public getMessages() {
    return this.socket$.asObservable();
  }

  public sendMessage(message: any) {
    this.socket$.next(message);
  }

  public closeConnection() {
    if (this.socket$) {
      this.socket$.complete();
    }

  }
}
