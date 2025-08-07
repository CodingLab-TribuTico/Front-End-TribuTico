import { inject, Injectable, signal } from '@angular/core';
import { IChatbotRequest, IChatbotResponse, IResponse } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService extends BaseService<IResponse<IChatbotRequest>> {
  protected override source: string = 'chatbot';
  private alertService: AlertService = inject(AlertService);
  private botTyping = signal(false);
  private messagesListSignal = signal<IChatbotResponse[]>([]);
  private currentChatId = signal<string>('');

  get botTyping$() {
    return this.botTyping;
  }

  get messages$() {
    return this.messagesListSignal;
  }

  get currentChatId$() {
    return this.currentChatId;
  }

  askQuestion(question: IChatbotRequest): void {
    this.botTyping.set(true);
    this.add(question).subscribe({
      next: (response: any) => {
        this.currentChatId.set(response.chatId);
        this.messagesListSignal.update(messages => [...messages,
        { chatId: this.currentChatId(), answer: response.answer, from: 'bot' }]
        );
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al enviar la pregunta al chatbot');
        this.botTyping.set(false);
      },
      complete: () => {
        this.botTyping.set(false);
      }
    });
  }

  cleanMessages(): void {
    this.messagesListSignal.update(() => [
      { chatId: '0', from: 'bot', answer: '¡Hola! Soy Tributario. ¿En qué puedo ayudarte hoy?' }
    ]);
  }

  lastId(): string {
    const messages = this.messagesListSignal();
    return messages.length > 0 ? String(messages[messages.length - 1].chatId || 0) : '0';
  }
}
