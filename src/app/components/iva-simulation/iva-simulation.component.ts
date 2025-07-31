import { Component, Input } from '@angular/core';
import { SectionIvaSimulationComponent } from './section-iva-simulation/section-iva-simulation.component';
import { TaxBaseComponent } from './tax-base/tax-base.component';
import { ExemptSalesComponent } from './exempt-sales/exempt-sales.component';
import { SalesNotSubjectComponent } from './sales-not-subject/sales-not-subject.component';
import { TotalSalesComponent } from './total-sales/total-sales.component';
import { IIvaCalculation } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-iva-simulation',
  standalone: true,
  imports: [SectionIvaSimulationComponent, TaxBaseComponent, ExemptSalesComponent, SalesNotSubjectComponent, TotalSalesComponent, CommonModule],
  templateUrl: './iva-simulation.component.html'
})
export class IvaSimulationComponent {
  @Input() simulationPeriod: string = '';
  @Input() simulationName: string = '';
  @Input() simulationIdentification: string = '';
  @Input() simulation!: IIvaCalculation;

  // Estados para las opciones SI/NO principales
  ventasSujetasEnabled: boolean = false;
  ventasExentasEnabled: boolean = false;
  ventasNoSujetasEnabled: boolean = false;

  // Estados para porcentajes individuales de VENTAS SUJETAS
  ventasSujetas05Enabled: boolean = false;
  ventasSujetas1Enabled: boolean = false;
  ventasSujetas2Enabled: boolean = false;
  ventasSujetas4Enabled: boolean = false;
  ventasSujetas8Enabled: boolean = false;
  ventasSujetas13Enabled: boolean = false;

  // Métodos para manejar cambios SI/NO principales
  toggleVentasSujetas = (value: boolean) => {
    this.ventasSujetasEnabled = value;
  }

  toggleVentasExentas = (value: boolean) => {
    this.ventasExentasEnabled = value;
  }

  toggleVentasNoSujetas = (value: boolean) => {
    this.ventasNoSujetasEnabled = value;
  }

  // Métodos para manejar porcentajes individuales de VENTAS SUJETAS
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

  toggleVentasSujetas13 = (value: boolean) => {
    this.ventasSujetas13Enabled = value;
  }

  // Getter para la sección de VENTAS SUJETAS (simplificado como ISR)
  get ventasSujetasItems() {
    if (!this.ventasSujetasEnabled) return [];
    
    return [
      { label: 'Bienes y servicios afectos al 0.5%', value: 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 1%', value: this.simulation?.iva1Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 2%', value: this.simulation?.iva2Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 4%', value: this.simulation?.iva4Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 8%', value: this.simulation?.iva8Percent || 0, isAutocalculated: true },
      { label: 'Bienes y servicios afectos al 13%', value: this.simulation?.iva13Percent || 0, isAutocalculated: true }
    ];
  }

  get ventasSujetasSection() {
    return {
      sectionTitle: 'I. TOTAL DE VENTAS SUJETAS, EXENTAS Y NO SUJETAS',
      hasToggle: false,
      toggleState: false, // Agregado para evitar error
      onToggle: () => {}, // Agregado para evitar error
      items: [], // Asegúrate de que esté aquí
      subsections: [
        {
          title: 'Ventas sujetas (Base imponible)',
          hasToggle: true,
          toggleState: this.ventasSujetasEnabled,
          onToggle: (value: boolean) => this.toggleVentasSujetas(value),
          subsections: [ // Volvemos a subsections normales, no nested
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
              title: 'BIENES Y SERVICIOS AFECTADOS AL 13%',
              hasToggle: true,
              toggleState: this.ventasSujetas13Enabled,
              onToggle: (value: boolean) => this.toggleVentasSujetas13(value),
              tableData: {
                headers: ['DETALLE', '13%'],
                rows: ['Bienes', 'Bienes de capital', 'Servicios', 'Uso o consumo personal de mercancías y servicios', 'Transferencias sin contraprestación a terceros'],
                values: []
              }
            }
          ]
        }
      ]
    };
  }

}
  


