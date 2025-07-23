import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-landing-page.component.html',
})
export class CardBenefitsComponent {
  @Input() bgColor: string = 'bg-golden-glow';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() iconIsUp: boolean = true;
  @Input() textColor: string = 'text-crater-brown';
  @Input() iconColor: string = 'text-crater-brown';
}
