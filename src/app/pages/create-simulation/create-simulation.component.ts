import { Component, inject } from '@angular/core';
import { IsrSimulationService } from '../../services/isr-simulation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { IManualInvoice } from '../../interfaces';
import { LoaderComponent } from '../../components/loader/loader.component';
import { AssetsLiabilitiesComponent } from '../../components/isr-simulation/assets-and-liabilities/assets-liabilities.component';
import { IncomeComponent } from '../../components/isr-simulation/income/income.component';
import { CostsExpensesDeductionsComponent } from '../../components/isr-simulation/costs-expenses-deductions/costs-expenses-deductions.component';
import { TaxBaseComponent } from '../../components/isr-simulation/tax-base/tax-base.component';
import { CreditsComponent } from '../../components/isr-simulation/credits/credits.component';
import { SettlementTaxDebtComponent } from '../../components/isr-simulation/settlement-tax-debt/settlement-tax-debt.component';
import { GeneralDataComponent } from '../../components/isr-simulation/general-data/general-data.component';

@Component({
  selector: 'app-create-simulation',
  standalone: true,
  imports: [GeneralDataComponent, CommonModule, ReactiveFormsModule, LoaderComponent,
    AssetsLiabilitiesComponent, IncomeComponent, CostsExpensesDeductionsComponent, TaxBaseComponent, CreditsComponent, SettlementTaxDebtComponent
  ],
  templateUrl: './create-simulation.component.html',
})
export class CreateSimulationComponent {
  public isrSimulationService: IsrSimulationService = inject(IsrSimulationService);
  public invoiceService = inject(InvoiceService);
  public type: string = 'isr'
  public year: number = 0;
  public childrenNumber: number = 0;
  public hasSpouse: boolean = false;
  public fb: FormBuilder = inject(FormBuilder);
  public isrSimulationShown: boolean = false;
  public isrSimulation: any = null;
  public years: number[] = [];

  public formIsrSimulation: FormGroup = this.fb.group({
    simulationType: ['isr', Validators.required],
    year: ["", Validators.required],
    childrenNumber: [0, [Validators.required, Validators.min(0)]],
    hasSpouse: [false],
  });

  constructor() {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    this.invoiceService.getByUserId(userId);
  }

  changeType(Event: any) {
    this.type = Event.target.value;

    if (this.type === 'isr') {
      this.type = 'isr';
    } else {
      this.type = 'iva';
    }
  }

  onSubmit() {
    if (this.formIsrSimulation.invalid || this.type !== 'isr') return;
    const { year, childrenNumber, hasSpouse } = this.formIsrSimulation.value;

    this.isrSimulationShown = false;

    this.isrSimulationService.createSimulation(year, childrenNumber, hasSpouse);

    setTimeout(() => {
      this.isrSimulation = this.isrSimulationService.isrSimulation;
      if (this.isrSimulation) {
        this.isrSimulationShown = true;
      }
    }, 300);
  }

  closeSimulation() {
    this.isrSimulationShown = false;
    this.isrSimulation = null;
  }

  loadInvoicesYears(invoices: IManualInvoice[] = []) {
    if (invoices.length > 0) {
      const issueDates = invoices
        .filter(invoice => typeof invoice.issueDate === 'string')
        .map(invoice => invoice.issueDate!.split('-')[0]);
      this.years = Array.from(new Set(issueDates.map(date => parseInt(date))));
    }
    return this.years.sort((a, b) => b - a);
  }
}
