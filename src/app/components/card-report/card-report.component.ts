import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-report.component.html'
})
export class CardReportComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = '';
  @Input() bgColor: string = 'bg-crater-brown';
  @Input() textColor: string = 'text-bisque';
  @Input() bgButtonColor: string = 'bg-flamenco';
  @Input() bgButtonHoverColor: string = 'hover:bg-golden-glow';
  @Input() bgButtonTextHoverColor: string = 'hover:text-flamenco';
  @Output() callClickMethod: EventEmitter<any> = new EventEmitter<any>();

  onButtonClick() {
    this.callClickMethod.emit();
  }
}
