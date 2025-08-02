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
    year: ['', Validators.required],
    month: ['', Validators.required]
  });

  constructor() {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    // Temporalmente deshabilitado para evitar error del backend
    // this.invoiceService.getByUserId(userId);
    this.generateYears();
    this.initializeMockData(); // Inicializar datos mock
    
    effect(() => {
      this.isrSimulation = this.isrSimulationService.isrSimulation;
      if (this.isrSimulation) {
        this.isrSimulationShown = true;
      }
    });

    effect(() => {
      this.ivaSimulation = this.ivaSimulationService.ivaSimulation;
      if (this.ivaSimulation) {
        this.ivaSimulationShown = true;
      }
    });
  }

  // Método temporal para inicializar datos mock
  initializeMockData() {
    // Simular facturas mock para que los formularios funcionen
    const mockInvoices: IManualInvoice[] = [
      {
        id: 1,
        issueDate: '2025-07-15',
        type: 'ingreso',
        consecutive: '001',
        key: 'mock-key-1'
      },
      {
        id: 2,
        issueDate: '2025-07-20',
        type: 'gasto',
        consecutive: '002',
        key: 'mock-key-2'
      }
    ];
    
    // Establecer los datos mock en el servicio
    this.invoiceService['invoicesList'].set(mockInvoices);
  }

  changeType(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.type = target.value;

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

    this.ivaSimulationShown = false;
    this.ivaSimulation = null; 

    this.ivaSimulationService.createSimulation(year, month, userId, (simulation) => {
      if (simulation) {
        this.ivaSimulation = simulation;
        this.ivaSimulationShown = true;
      } else {
        console.error('Error: No se pudo cargar la simulación IVA');
      }
    });
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
    if (invoices && invoices.length > 0) {
      const issueDates = invoices
        .filter(invoice => typeof invoice.issueDate === 'string')
        .map(invoice => invoice.issueDate!.split('-')[0]);
      this.years = Array.from(new Set(issueDates.map(date => parseInt(date))));
      return this.years.sort((a, b) => b - a);
    }
    // Si no hay facturas, devolver años generados
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
      // Si no hay facturas, devolver todos los meses
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
}
