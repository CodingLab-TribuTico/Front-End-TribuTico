import { Component, effect, inject } from '@angular/core';
import { IsrSimulationComponent } from '../../components/isr-simulation/isr-simulation.component';
import { IsrSimulationService } from '../../services/isr-simulation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { IManualInvoice } from '../../interfaces';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-create-simulation',
  standalone: true,
  imports: [IsrSimulationComponent, CommonModule, ReactiveFormsModule, LoaderComponent],
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
    const user = localStorage.getItem('auth_user') && JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;

    this.isrSimulationShown = false;

    this.isrSimulationService.createSimulation(year, childrenNumber, hasSpouse, userId);

    console.log('ISR Simulation:', this.isrSimulation);
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
