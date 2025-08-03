import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [],
  templateUrl: './credits.component.html'
})
export class CreditsComponent {
  @Input() familyCredit: number = 0;
  @Input() otherCredits: number = 0;
  @Input() periodTax: number = 0;
  @Input() twoPercentWithholdings: number = 0;
  @Input() otherWithholdings: number = 0;
  @Input() partialPayments: number = 0;
  @Input() totalNetTax: number = 0;
}
