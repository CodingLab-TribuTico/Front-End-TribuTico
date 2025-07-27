import { Component, effect, inject } from '@angular/core';
import { IsrSimulationComponent } from '../../components/isr-simulation/isr-simulation.component';
import { IvaSimulationComponent } from '../../components/iva-simulation/iva-simulation.component';
import { IsrSimulationService } from '../../services/isr-simulation.service';
import { IvaSimulationService } from '../../services/iva-simulation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { IManualInvoice, IIsrSimulation, IIvaCalculation } from '../../interfaces';

@Component({
  selector: 'app-create-simulation',
  standalone: true,
  imports: [IsrSimulationComponent, IvaSimulationComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './create-simulation.component.html',
})
export class CreateSimulationComponent {
  public isrSimulationService: IsrSimulationService = inject(IsrSimulationService);
  public ivaSimulationService: IvaSimulationService = inject(IvaSimulationService);
  public invoiceService = inject(InvoiceService);
  public type: string = 'isr'
  public year: number = 0;
  public childrenNumber: number = 0;
  public hasSpouse: boolean = false;
  public fb: FormBuilder = inject(FormBuilder);
  public isrSimulationShown: boolean = false;
  public ivaSimulationShown: boolean = false;
  public isrSimulation: IIsrSimulation | null = null;
  public ivaSimulation: IIvaCalculation | null = null;
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
    simulationType: ['isr', Validators.required],
    year: ["", Validators.required],
    childrenNumber: [0, [Validators.required, Validators.min(0)]],
    hasSpouse: [false],
  });

  public formIvaSimulation: FormGroup = this.fb.group({
    simulationType: ['iva', Validators.required],
    year: [new Date().getFullYear(), Validators.required],
    month: [new Date().getMonth() + 1, Validators.required]
  });

  constructor() {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    this.invoiceService.getByUserId(userId);
    this.generateYears();
    
    // Effect para ISR
    effect(() => {
      this.isrSimulation = this.isrSimulationService.isrSimulation;
      if (this.isrSimulation) {
        this.isrSimulationShown = true;
      }
    });

    // Effect para IVA - usamos el observable para reactividad
    effect(() => {
      this.ivaSimulationService.ivaSimulation$.subscribe(simulation => {
        this.ivaSimulation = simulation;
        if (simulation) {
          this.ivaSimulationShown = true;
          console.log('IVA Simulation actualizada en el componente padre:', simulation);
        }
      });
    });
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

    console.log('Enviando simulación IVA con datos:', { year, month, userId });
    
    this.ivaSimulationShown = false;
    this.ivaSimulation = null; // Reset previous simulation

    this.ivaSimulationService.createSimulation(year, month, userId);
    // El effect se encargará de mostrar la simulación cuando llegue la respuesta
  }

  closeSimulation() {
    this.isrSimulationShown = false;
    this.ivaSimulationShown = false;
    this.isrSimulation = null;
    this.ivaSimulation = null;
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      this.years.push(year);
    }
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
