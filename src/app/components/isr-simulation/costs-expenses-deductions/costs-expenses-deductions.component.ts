import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-costs-expenses-deductions',
  standalone: true,
  imports: [],
  templateUrl: './costs-expenses-deductions.component.html',
})
export class CostsExpensesDeductionsComponent {
  @Input() initialInventory: number = 0;
  @Input() purchases: number = 0;
  @Input() finalInventory: number = 0;
  @Input() costOfGoodsSold: number = 0;
  @Input() financialExpenses: number = 0;
  @Input() administrativeExpenses: number = 0;
  @Input() depreciationAndAmortization: number = 0;
  @Input() pensionContributions: number = 0;
  @Input() otherAllowableDeductions: number = 0;
  @Input() totalAllowableDeductions: number = 0;
}
