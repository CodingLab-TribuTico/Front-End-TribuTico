import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IIvaCalculation } from '../../interfaces';

@Component({
  selector: 'app-iva-simulation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iva-simulation.component.html'
})
export class IvaSimulationComponent implements OnInit {
  @Input() simulation!: IIvaCalculation;

  // Variables para controlar la expansión de secciones
  public showVentasSujetas: boolean = true; // Iniciamos con "Sí" por defecto
  public showVentasExentas: boolean = false;
  public showVentasNoSujetas: boolean = false;
  
  // Variables para las diferentes tasas de ventas
  public showVentasTasa05: boolean = false;  // 0.5%
  public showVentasTasa1: boolean = false;   // 1%
  public showVentasTasa2: boolean = false;   // 2%
  public showVentasTasa4: boolean = false;   // 4%
  public showVentasTasa8: boolean = false;   // 8%
  public showVentasTasa13: boolean = true;   // 13% (por defecto)
  
  // Variables para compras
  public showComprasIvaAcreditable: boolean = false;
  public showComprasBienesServicios: boolean = false;
  
  // Variables para IVA no acreditable
  public showIvaNoAcreditable: boolean = false;

  ngOnInit() {
    console.log('Simulación IVA recibida en el componente:', this.simulation);
    console.log('Tipo de simulation:', typeof this.simulation);
    if (this.simulation) {
      console.log('Propiedades de la simulación:');
      console.log('- ivaVentasBienes:', this.simulation.ivaVentasBienes, typeof this.simulation.ivaVentasBienes);
      console.log('- ivaComprasBienes:', this.simulation.ivaComprasBienes, typeof this.simulation.ivaComprasBienes);
      console.log('- totalIvaDebito:', this.simulation.totalIvaDebito, typeof this.simulation.totalIvaDebito);
      console.log('- ivaNetoPorPagar:', this.simulation.ivaNetoPorPagar, typeof this.simulation.ivaNetoPorPagar);
    }
  }

  get simulationPeriod(): string {
    if (!this.simulation) return '';
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${monthNames[this.simulation.month - 1]} ${this.simulation.year}`;
  }

  get simulationIdentification(): string {
    return this.simulation?.user?.identification || 'N/A';
  }

  get simulationName(): string {
    const user = this.simulation?.user;
    if (!user) return 'N/A';
    
    const parts = [user.name, user.lastname, user.lastname2]
      .filter(part => part && part.trim() !== '');
    
    const uniqueParts = parts.filter((part, index) => 
      parts.indexOf(part) === index
    );
    
    return uniqueParts.join(' ') || 'N/A';
  }

  formatCurrency(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      console.warn('Valor inválido para formatCurrency:', value);
      return '₡0.00';
    }
    
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 2
    }).format(value);
  }

  getSafeValue(value: number): number {
    return (value === null || value === undefined || isNaN(value)) ? 0 : value;
  }

  
  getTotalVentasSujetas(): number {
    const ventasBienes = this.getSafeValue(this.simulation.ivaVentasBienes) / 0.13;
    const ventasServicios = this.getSafeValue(this.simulation.ivaVentasServicios) / 0.13;
    const exportaciones = this.getSafeValue(this.simulation.ivaExportaciones) / 0.13;
    const agropecuarias = this.getSafeValue(this.simulation.ivaActividadesAgropecuarias) / 0.13;
    
    return ventasBienes + ventasServicios + exportaciones + agropecuarias;
  }

  
  getTotalBaseImponibleCredito(): number {
    const comprasBienes = this.getSafeValue(this.simulation.ivaComprasBienes) / 0.13;
    const comprasServicios = this.getSafeValue(this.simulation.ivaComprasServicios) / 0.13;
    const importaciones = this.getSafeValue(this.simulation.ivaImportaciones) / 0.13;
    const gastosGenerales = this.getSafeValue(this.simulation.ivaGastosGenerales) / 0.13;
    const activosFijos = this.getSafeValue(this.simulation.ivaActivosFijos) / 0.13;
    
    return comprasBienes + comprasServicios + importaciones + gastosGenerales + activosFijos;
  }

  /**
   * Maneja el cambio de estado para ventas sujetas
   */
  onVentasSujetasChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasSujetas = target.value === 'si';
  }

  /**
   * Maneja el cambio de estado para ventas exentas
   */
  onVentasExentasChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasExentas = target.value === 'si';
  }

  /**
   * Maneja el cambio de estado para ventas no sujetas
   */
  onVentasNoSujetasChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasNoSujetas = target.value === 'si';
  }

  // Métodos para manejar las diferentes tasas de IVA
  onVentasTasa05Change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasTasa05 = target.value === 'si';
  }

  onVentasTasa1Change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasTasa1 = target.value === 'si';
  }

  onVentasTasa2Change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasTasa2 = target.value === 'si';
  }

  onVentasTasa4Change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasTasa4 = target.value === 'si';
  }

  onVentasTasa8Change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasTasa8 = target.value === 'si';
  }

  onVentasTasa13Change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showVentasTasa13 = target.value === 'si';
  }

  // Métodos para compras
  onComprasIvaAcreditableChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showComprasIvaAcreditable = target.value === 'si';
  }

  onComprasBienesServiciosChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showComprasBienesServicios = target.value === 'si';
  }

  // Método para IVA no acreditable
  onIvaNoAcreditableChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showIvaNoAcreditable = target.value === 'si';
  }
}
