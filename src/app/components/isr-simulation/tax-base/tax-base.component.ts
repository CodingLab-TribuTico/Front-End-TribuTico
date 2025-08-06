import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tax-base',
  standalone: true,
  imports: [],
  templateUrl: './tax-base.component.html',
})
export class TaxBaseComponent {
  @Input() netTaxableIncome: number = 0;
  @Input() nonTaxableSalaryAmount: number = 0;
  @Input() incomeTax: number = 0;
  @Input() freeTradeZoneExemption: number = 0;
  @Input() otherExemptions: number = 0;
  @Input() netIncomeTaxAfterExemptions: number = 0;
}
