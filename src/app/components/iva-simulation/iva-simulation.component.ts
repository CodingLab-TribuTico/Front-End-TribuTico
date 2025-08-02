import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionIvaSimulationComponent } from './section-iva-simulation/section-iva-simulation.component';
import { TaxBaseComponent } from './tax-base/tax-base.component';
import { ExemptSalesComponent } from './exempt-sales/exempt-sales.component';
import { SalesNotSubjectComponent } from './sales-not-subject/sales-not-subject.component';
import { TotalSalesComponent } from './total-sales/total-sales.component';
import { IIvaCalculation } from '../../interfaces';
import { IvaSimulationService } from '../../services/iva-simulation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-iva-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionIvaSimulationComponent, TaxBaseComponent, ExemptSalesComponent, SalesNotSubjectComponent, TotalSalesComponent],
  templateUrl: './iva-simulation.component.html'
})
export class IvaSimulationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() simulationPeriod: string = '';
  @Input() simulationName: string = '';
  @Input() simulationIdentification: string = '';
  @Input() simulation!: IIvaCalculation;

  // Formulario para crear simulación
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;
  loading = false;
  showCreateForm = true;

  ventasSujetasEnabled: boolean = false;
  ventasExentasEnabled: boolean = false;
  ventasNoSujetasEnabled: boolean = false;

  ventasSujetas05Enabled: boolean = false;
  ventasSujetas1Enabled: boolean = false;
  ventasSujetas2Enabled: boolean = false;
  ventasSujetas4Enabled: boolean = false;
  ventasSujetas8Enabled: boolean = false;
  ventasSujetas10Enabled: boolean = false; // ✅ NUEVO
  ventasSujetas13Enabled: boolean = false;

  constructor(
    private ivaService: IvaSimulationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Obtener datos del usuario actual si no hay simulación
    if (!this.simulation) {
      const currentUser = this.authService.getUser();
      if (currentUser) {
        this.simulationName = `${currentUser.name || ''} ${currentUser.lastname || ''}`;
        this.simulationIdentification = currentUser.identification || '';
      }
    }

    // Auto-activar secciones que tienen datos
    this.autoActivateSectionsWithData();
  }

  ngOnChanges(changes: SimpleChanges): void {    
    if (changes['simulation'] && changes['simulation'].currentValue) {
      // Re-activar secciones cuando cambian los datos
      setTimeout(() => {
        this.autoActivateSectionsWithData();
        // Forzar detección de cambios
        this.cdr.detectChanges();
      }, 0);
    }
  }

  // Auto-activar secciones que tienen datos
  autoActivateSectionsWithData(): void {
    const sim = this.currentSimulation;
    
    if (!sim) {
      return;
    }

    // Activar base imponible si hay datos
    if (sim.iva1Percent || sim.iva2Percent || sim.iva4Percent || sim.iva8Percent || sim.iva10Percent || sim.iva13Percent ||
        sim.ivaVentasBienes || sim.ivaVentasServicios) {
      this.ventasSujetasEnabled = true;
    }

    // Activar cada sección específica si tiene datos
    if (sim.iva1Percent && sim.iva1Percent > 0) {
      this.ventasSujetas1Enabled = true;
    }
    if (sim.iva2Percent && sim.iva2Percent > 0) {
      this.ventasSujetas2Enabled = true;
    }
    if (sim.iva4Percent && sim.iva4Percent > 0) {
      this.ventasSujetas4Enabled = true;
    }
    if (sim.iva8Percent && sim.iva8Percent > 0) {
      this.ventasSujetas8Enabled = true;
    }
    
    if (sim.iva10Percent && sim.iva10Percent > 0) {
      this.ventasSujetas10Enabled = true;
    }
    
    if (sim.iva13Percent && sim.iva13Percent > 0) {
      this.ventasSujetas13Enabled = true;
    }
    
    // Activar también si hay ventas de bienes o servicios
    if (sim.ivaVentasBienes && sim.ivaVentasBienes > 0) {
      this.ventasSujetas13Enabled = true;
    }
    if (sim.ivaVentasServicios && sim.ivaVentasServicios > 0) {
      this.ventasSujetas13Enabled = true;
    }

    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.ivaService.clearSimulation();
  }

  // Getter para obtener la simulación actual del servicio
  get currentSimulation(): IIvaCalculation | null {
    return this.simulation || this.ivaService.ivaSimulation;
  }

  // Crear simulación
  createSimulation(): void {
    const currentUser = this.authService.getUser();
    const userId = this.authService.getCurrentUserId();
    
    if (!currentUser || !userId) {
      console.error('No hay usuario autenticado');
      return;
    }

    this.loading = true;
    
    this.ivaService.createSimulation(this.selectedYear, this.selectedMonth, userId);
    
    // Simular un delay para mostrar el loading
    setTimeout(() => {
      this.loading = false;
      // Actualizar los datos de periodo si se creó la simulación
      if (this.ivaService.ivaSimulation) {
        this.simulationPeriod = `${this.getMonthName(this.ivaService.ivaSimulation.month)} ${this.ivaService.ivaSimulation.year}`;
      }
    }, 1500);
  }

  // Obtener nombre del mes
  getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || 'Mes desconocido';
  }

  // Formatear moneda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 2
    }).format(value);
  }

  toggleVentasSujetas = (value: boolean) => {
    this.ventasSujetasEnabled = value;
  }

  toggleVentasExentas = (value: boolean) => {
    this.ventasExentasEnabled = value;
  }

  toggleVentasNoSujetas = (value: boolean) => {
    this.ventasNoSujetasEnabled = value;
  }

  toggleVentasSujetas05 = (value: boolean) => {
    this.ventasSujetas05Enabled = value;
  }

  toggleVentasSujetas1 = (value: boolean) => {
    this.ventasSujetas1Enabled = value;
  }

  toggleVentasSujetas2 = (value: boolean) => {
    this.ventasSujetas2Enabled = value;
  }

  toggleVentasSujetas4 = (value: boolean) => {
    this.ventasSujetas4Enabled = value;
  }

  toggleVentasSujetas8 = (value: boolean) => {
    this.ventasSujetas8Enabled = value;
  }

  toggleVentasSujetas10 = (value: boolean) => {
    this.ventasSujetas10Enabled = value;
  }

  toggleVentasSujetas13 = (value: boolean) => {
    this.ventasSujetas13Enabled = value;
  }

  get ventasSujetasItems() {
    const sim = this.currentSimulation;
    if (!this.ventasSujetasEnabled || !sim) return [];
    
    return [
      { label: 'Bienes y servicios afectos al 0.5%', value: 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 1%', value: sim.iva1Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 2%', value: sim.iva2Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 4%', value: sim.iva4Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 8%', value: sim.iva8Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 10%', value: sim.iva10Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 13%', value: sim.iva13Percent || 0, isAutocalculated: true }
    ];
  }

  get ventasSujetasSection() {
    return {
      sectionTitle: 'I. TOTAL DE VENTAS SUJETAS, EXENTAS Y NO SUJETAS',
      hasToggle: false,
      toggleState: false, 
      onToggle: () => {}, 
      items: [], 
      subsections: [
        {
          title: 'Ventas sujetas (Base imponible)',
          hasToggle: true,
          toggleState: this.ventasSujetasEnabled,
          onToggle: (value: boolean) => this.toggleVentasSujetas(value),
          subsections: [ 
            {
              title: 'BIENES Y SERVICIOS AFECTADOS AL 0,5%',
              hasToggle: true,
              toggleState: this.ventasSujetas05Enabled,
              onToggle: (value: boolean) => this.toggleVentasSujetas05(value),
              tableData: {
                headers: ['DETALLE', '0.5%'],
                rows: ['Bienes', 'Bienes de capital', 'Servicios', 'Uso o consumo personal de mercancías y servicios', 'Transferencias sin contraprestación a terceros'],
                values: []
              }
            },
            {
              title: 'BIENES Y SERVICIOS AFECTADOS AL 1%',
              hasToggle: true,
              toggleState: this.ventasSujetas1Enabled,
              onToggle: (value: boolean) => this.toggleVentasSujetas1(value),
              tableData: {
                headers: ['DETALLE', '1%'],
                rows: ['Bienes', 'Bienes de capital', 'Servicios', 'Uso o consumo personal de mercancías y servicios', 'Transferencias sin contraprestación a terceros'],
                values: []
              }
            },
            {
              title: 'BIENES Y SERVICIOS AFECTADOS AL 2%',
              hasToggle: true,
              toggleState: this.ventasSujetas2Enabled,
              onToggle: (value: boolean) => this.toggleVentasSujetas2(value),
              tableData: {
                headers: ['DETALLE', '2%'],
                rows: ['Bienes', 'Bienes de capital', 'Servicios', 'Uso o consumo personal de mercancías y servicios', 'Transferencias sin contraprestación a terceros'],
                values: []
              }
            },
            {
              title: 'BIENES Y SERVICIOS AFECTADOS AL 4%',
              hasToggle: true,
              toggleState: this.ventasSujetas4Enabled,
              onToggle: (value: boolean) => this.toggleVentasSujetas4(value),
              tableData: {
                headers: ['DETALLE', '4%'],
                rows: ['Bienes', 'Bienes de capital', 'Servicios', 'Uso o consumo personal de mercancías y servicios', 'Transferencias sin contraprestación a terceros'],
                values: []
              }
            },
            {
              title: 'BIENES Y SERVICIOS AFECTADOS AL 8%',
              hasToggle: true,
              toggleState: this.ventasSujetas8Enabled,
              onToggle: (value: boolean) => this.toggleVentasSujetas8(value),
              tableData: {
                headers: ['DETALLE', '8%'],
                rows: ['Bienes', 'Bienes de capital', 'Servicios', 'Uso o consumo personal de mercancías y servicios', 'Transferencias sin contraprestación a terceros'],
                values: []
              }
            },
            {
              title: 'BIENES Y SERVICIOS AFECTADOS AL 10%',
              hasToggle: true,
              toggleState: this.ventasSujetas10Enabled,
              onToggle: (value: boolean) => this.toggleVentasSujetas10(value),
              tableData: {
                headers: ['DETALLE', '10%'],
                rows: ['Bienes', 'Bienes de capital', 'Servicios', 'Uso o consumo personal de mercancías y servicios', 'Transferencias sin contraprestación a terceros'],
                values: this.getTableValues(10)
              }
            },
            {
              title: 'BIENES Y SERVICIOS AFECTADOS AL 13%',
              hasToggle: true,
              toggleState: this.ventasSujetas13Enabled,
              onToggle: (value: boolean) => this.toggleVentasSujetas13(value),
              tableData: {
                headers: ['DETALLE', '13%'],
                rows: ['Bienes', 'Bienes de capital', 'Servicios', 'Uso o consumo personal de mercancías y servicios', 'Transferencias sin contraprestación a terceros'],
                values: this.getTableValues(13)
              }
            }
          ]
        }
      ]
    };
  }

  // Método para obtener los valores de la tabla según la tarifa
  getTableValues(percentage: number): { [key: string]: number }[] {
    const sim = this.currentSimulation;
    
    if (!sim) {
      return [{}, {}, {}, {}, {}];
    }

    const percentageKey = `${percentage}%`;
    let rawValues: number[] = [];

    switch (percentage) {
      case 10:
        // Para 10%, usar directamente el campo iva10Percent
        rawValues = [
          sim.iva10Percent || 0, // Bienes - usar directamente el valor del backend
          0, // Bienes de capital
          0, // Servicios - por ahora en 0, ajustar si hay campo específico
          0, // Uso o consumo personal
          0  // Transferencias
        ];
        break;
      case 13:
        // Para 13%, usar los campos específicos del JSON
        rawValues = [
          sim.ivaVentasBienes || 0, // Bienes (130 según tu JSON)
          0, // Bienes de capital  
          sim.ivaVentasServicios || 0, // Servicios (100 según tu JSON)
          0, // Uso o consumo personal
          0  // Transferencias
        ];
        break;
      default:
        return [{}, {}, {}, {}, {}];
    }

    // Convertir array simple a formato de objetos que espera la tabla
    const formattedValues = rawValues.map(value => ({ [percentageKey]: value }));
    
    return formattedValues;
  }

}
  


