import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-card-how-works',
  standalone: true,
  imports: [],
  templateUrl: './card-how-works.component.html',
})
export class CardHowWorksComponent {
  @Input() title: string = '';
  @Input() description: string = '';
}
