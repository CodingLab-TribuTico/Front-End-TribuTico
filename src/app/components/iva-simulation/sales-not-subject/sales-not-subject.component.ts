import { Component, Input } from '@angular/core';
import { SectionIvaSimulationComponent } from '../section-iva-simulation/section-iva-simulation.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sales-not-subject',
    standalone: true,
    imports: [SectionIvaSimulationComponent, CommonModule],
    templateUrl: './sales-not-subject.component.html'
})
export class SalesNotSubjectComponent {
    @Input() simulationPeriod: string = '';
    @Input() simulationName: string = '';
    @Input() simulationIdentification: string = '';
    @Input() simulation?: any; // Temporal hasta definir las propiedades

    // Estado para controlar si se muestra la tabla
    salesNotSubjectEnabled: boolean = false;

    // Método para manejar el toggle
    toggleSalesNotSubject = (value: boolean) => {
        this.salesNotSubjectEnabled = value;
    }

    get salesNotSubjectItems() {
        return {
            sectionTitle: 'VENTAS NO SUJETAS (BASE IMPONIBLE)',
            hasToggle: true,
            toggleState: this.salesNotSubjectEnabled,
            onToggle: this.toggleSalesNotSubject,
            items: [],
            tableData: {
                headers: ['DETALLE', 'MONTO'],
                rows: [
                    'BIENES Y SERVICIOS A LA CCSS',
                    'BIENES Y SERVICIOS A LAS CORPORACIONES MUNICIPALES',
                    'OTRAS VENTAS NO SUJETAS'
                ],
                values: [
                    // Fila 1: BIENES Y SERVICIOS A LA CCSS
                    { 'MONTO': this.simulation?.goodsServicesCCSS || 0 },
                    // Fila 2: BIENES Y SERVICIOS A LAS CORPORACIONES MUNICIPALES
                    { 'MONTO': this.simulation?.goodsServicesMunicipal || 0 },
                    // Fila 3: OTRAS VENTAS NO SUJETAS
                    { 'MONTO': this.simulation?.otherNonSubjectSales || 0 }
                ]
            }
        };
    }

    // Método para formatear moneda
    formatCurrency(value: number): string {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 2
        }).format(value);
    }
}