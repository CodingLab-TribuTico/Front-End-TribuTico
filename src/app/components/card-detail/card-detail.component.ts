import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [],
  templateUrl: './card-detail.component.html',
})
export class CardDetailComponent {
  @Input() cabys: string = '';
  @Input() quantity: Number = 0;
  @Input() unit: string = '';
  @Input() unitPrice: Number = 0;
  @Input() discount: Number = 0;
  @Input() tax: Number = 0;
  @Input() taxAmount: Number = 0;
  @Input() category: string = '';
  @Input() total: Number = 0;
  @Input() detailDescription: string = '';
}
