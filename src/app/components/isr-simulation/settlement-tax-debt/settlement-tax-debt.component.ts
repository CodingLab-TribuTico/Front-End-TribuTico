import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settlement-tax-debt',
  standalone: true,
  imports: [],
  templateUrl: './settlement-tax-debt.component.html'
})
export class SettlementTaxDebtComponent {
  @Input() interests: number = 0;
  @Input() totalTaxDebt: number = 0;
  @Input() requestedCompensation: number = 0;
  @Input() totalDebtToPay: number = 0;
}
