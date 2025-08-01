import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [],
  templateUrl: './income.component.html'
})
export class IncomeComponent {
  @Input() salesRevenue: number = 0;
  @Input() professionalFees: number = 0;
  @Input() commissions: number = 0;
  @Input() interestsAndYields: number = 0;
  @Input() dividendsAndShares: number = 0;
  @Input() rents: number = 0;
  @Input() otherIncome: number = 0;
  @Input() nonTaxableIncome: number = 0;
  @Input() grossIncomeTotal: number = 0;
}
