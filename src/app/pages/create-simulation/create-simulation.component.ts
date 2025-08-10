import { Component, inject } from '@angular/core';
import { IsrSimulationService } from '../../services/isr-simulation.service';
import { IvaSimulationService } from '../../services/iva-simulation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { IManualInvoice, IIsrSimulation, IIvaCalculation } from '../../interfaces';
import { LoaderComponent } from '../../components/loader/loader.component';
import { AssetsLiabilitiesComponent } from '../../components/isr-simulation/assets-and-liabilities/assets-liabilities.component';
import { IncomeComponent } from '../../components/isr-simulation/income/income.component';
import { CostsExpensesDeductionsComponent } from '../../components/isr-simulation/costs-expenses-deductions/costs-expenses-deductions.component';
import { TaxBaseComponent } from '../../components/isr-simulation/tax-base/tax-base.component';
import { CreditsComponent } from '../../components/isr-simulation/credits/credits.component';
import { SettlementTaxDebtComponent } from '../../components/isr-simulation/settlement-tax-debt/settlement-tax-debt.component';
import { GeneralDataComponent } from '../../components/isr-simulation/general-data/general-data.component';
import { IvaSimulationComponent } from '../../components/iva-simulation/iva-simulation.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-simulation',
  standalone: true,
  imports: [GeneralDataComponent, CommonModule, ReactiveFormsModule, LoaderComponent,
    AssetsLiabilitiesComponent, IncomeComponent, CostsExpensesDeductionsComponent, TaxBaseComponent, CreditsComponent, SettlementTaxDebtComponent, IvaSimulationComponent
  ],
  templateUrl: './create-simulation.component.html',
})
export class CreateSimulationComponent {
  public isrSimulationService: IsrSimulationService = inject(IsrSimulationService);
  public ivaSimulationService: IvaSimulationService = inject(IvaSimulationService);
  public invoiceService = inject(InvoiceService);
  public authService = inject(AuthService);
  public type: string = 'isr'
  public year: number = 0;
  public childrenNumber: number = 0;
  public hasSpouse: boolean = false;
  public fb: FormBuilder = inject(FormBuilder);
  public isrSimulationShown: boolean = false;
  public ivaSimulationShown: boolean = false;
  public isrSimulation: any = null;
  public ivaSimulation: any = null;
  public years: number[] = [];
  public months: { value: number, name: string }[] = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' }
  ];

  public formIsrSimulation: FormGroup = this.fb.group({
    year: ["", Validators.required],
    childrenNumber: [0, [Validators.required, Validators.min(0)]],
    hasSpouse: [false],
  });

  public formIvaSimulation: FormGroup = this.fb.group({
    year: ['', Validators.required],
    month: ['', Validators.required]
  });

  constructor() {
    this.invoiceService.getAll();
  }

  changeType(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.type = target.value;

    this.isrSimulationShown = false;
    this.ivaSimulationShown = false;
    this.isrSimulation = null;
    this.ivaSimulation = null;
  }

  onSubmitISR() {
    if (this.formIsrSimulation.invalid || this.type !== 'isr') return;
    const { year, childrenNumber, hasSpouse } = this.formIsrSimulation.value;

    this.isrSimulationShown = false;
    this.isrSimulation = null;

    this.isrSimulationService.createSimulation(year, childrenNumber, hasSpouse);

    setTimeout(() => {
      this.isrSimulation = this.isrSimulationService.isrSimulation;
      if (this.isrSimulation) {
        this.isrSimulationShown = true;
      }
    }, 300);
  }

  onSubmitIVA() {
    if (this.formIvaSimulation.invalid || this.type !== 'iva') return;
    const { year, month } = this.formIvaSimulation.value;
    const user = localStorage.getItem('auth_user') && JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;

    this.ivaSimulationShown = false;
    this.ivaSimulation = null;

    this.ivaSimulationService.createSimulation(year, month, userId);

    setTimeout(() => {
      this.ivaSimulation = this.ivaSimulationService.ivaSimulation;
      if (this.ivaSimulation) {
        this.ivaSimulationShown = true;
      }
    }, 300);
  }

  closeSimulation() {
    this.isrSimulationShown = false;
    this.ivaSimulationShown = false;
    this.isrSimulation = null;
    this.ivaSimulation = null;
  }

  loadInvoicesYears(invoices: IManualInvoice[] = []) {
    if (invoices && invoices.length > 0) {
      const issueDates = invoices
        .filter(invoice => typeof invoice.issueDate === 'string')
        .map(invoice => invoice.issueDate!.split('-')[0]);
      this.years = Array.from(new Set(issueDates.map(date => parseInt(date))));
      return this.years.sort((a, b) => b - a);
    }
    return this.years.sort((a, b) => b - a);
  }

  getIvaSimulationPeriod(): string {
    if (!this.ivaSimulation) return '';
    const { year, month } = this.formIvaSimulation.value;
    const monthName = this.months.find(m => m.value === month)?.name || '';
    return `${monthName} ${year}`;
  }

  getIvaSimulationName(): string {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    return `${user.name || ''} ${user.lastname || ''}`.trim();
  }

  getIvaSimulationIdentification(): string {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    return user.identification || '';
  }

  getAvailableMonths(): { value: number, name: string }[] {
    const invoices = this.invoiceService.invoices$();

    if (!invoices || invoices.length === 0) {
      return this.months;
    }

    const availableMonths = new Set<number>();
    invoices.forEach(invoice => {
      if (invoice.issueDate) {
        const month = new Date(invoice.issueDate).getMonth() + 1;
        availableMonths.add(month);
      }
    });

    const filteredMonths = this.months.filter(month => availableMonths.has(month.value));

    return filteredMonths.length > 0 ? filteredMonths : this.months;
  }

  isIvaFormValid(): boolean {
    return this.formIvaSimulation.valid;
  }

  isIsrFormValid(): boolean {
    return this.formIsrSimulation.valid;
  }

  getIsrButtonText(): string {
    if (this.type !== 'isr') return 'Crear simulación ISR';

    const { year, childrenNumber, hasSpouse } = this.formIsrSimulation.value;

    if (!year) return 'Seleccione un año';
    if (childrenNumber === null || childrenNumber === undefined) return 'Ingrese número de hijos';
    if (hasSpouse === null || hasSpouse === undefined) return 'Seleccione si tiene cónyuge';

    return 'Crear simulación ISR';
  }

  getIvaButtonText(): string {
    if (this.type !== 'iva') return 'Crear simulación IVA';

    const { year, month } = this.formIvaSimulation.value;

    if (!year) return 'Seleccione un año';
    if (!month) return 'Seleccione un mes';

    return 'Crear simulación IVA';
  }

  saveSimulationIsr(): void {
    const userId = this.authService.getCurrentUserId();
    if (!this.isrSimulationService || !userId || !this.isrSimulation){
      return;
    }
    const simulationToSave = {
      ...this.isrSimulation,
      user: { id: userId }
    };
    this.isrSimulationService.saveSimulationIsr(simulationToSave);
  }

  saveSimulationIva(): void {
    const userId = this.authService.getCurrentUserId();
    if (!this.ivaSimulationService || !userId || !this.ivaSimulation){
      return;
    }
    const simulationToSave = {
      ...this.ivaSimulation,
      user: { id: userId }
    };
    this.ivaSimulationService.saveSimulationIva(simulationToSave);
  }

}


