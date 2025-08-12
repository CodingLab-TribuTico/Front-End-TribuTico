import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-faq-chatbot',
  standalone: true,
  imports: [],
  templateUrl: './faq-chatbot.component.html',
})
export class FaqChatbotComponent {
  @Input() description: string = '';
  @Output() callFaqClick: EventEmitter<any> = new EventEmitter<any>();

  onFaqClick(): void {
    this.callFaqClick.emit(this.description);
  }
}
