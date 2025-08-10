import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatbotService } from '../../services/chatbot.service';
import { IChatbotRequest } from '../../interfaces';
import { FaqChatbotComponent } from '../../components/faq-chatbot/faq-chatbot.component';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, FaqChatbotComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  public chatbotService = inject(ChatbotService);
  private fb = inject(FormBuilder);

  public chatbotForm: FormGroup;
  public userName: string = '';

  public faqDescription: string[] = [
    '¿Cuándo y cómo debo declarar el IVA?',
    '¿Cuándo y cómo debo declarar la Renta?',
    '¿Cómo puedo declarar mis impuestos?',
    '¿Qué documentos necesito para declarar?',
    '¿Qué sucede si me atraso en una declaración o pago?'
  ];

  constructor() {
    this.chatbotForm = this.fb.group({
      question: ['', Validators.required]
    });

    const user = localStorage.getItem('auth_user');
    if (user) {
      const parsed = JSON.parse(user);
      this.userName = parsed.name || 'Tú';
    }
    this.chatbotService.cleanMessages();

  }

  updateChat(): void {
    const input = this.chatbotForm.value.question?.trim();
    if (!input) return;

    this.chatbotService.messages$.update(messages => [...messages, { from: 'user', answer: input }]);
    this.chatbotForm.reset();
    this.scrollChat();

    const lastId = this.chatbotService.currentChatId$();
    this.chatbotService.askQuestion({ chatId: lastId, question: input });
  }

  updateChatWithFaq(description: string): void {
    this.chatbotService.messages$.update(messages => [...messages, { from: 'user', answer: description }]);

    this.chatbotService.askQuestion({ question: description });
    this.chatbotForm.reset();
    this.scrollChat();
  }

  scrollChat(): void {
    setTimeout(() => {
      const container = document.getElementById("messages");
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }
}
