import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-corporate-identity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-corporate-identity.component.html',
})
export class CardCorporateIdentityComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() description: string = '';
  @Input() black: boolean = true;
}
