import { Component, Input } from '@angular/core';
import { SectionIvaSimulationComponent } from '../section-iva-simulation/section-iva-simulation.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-total-sales',
    standalone: true,
    imports: [SectionIvaSimulationComponent, CommonModule],
    templateUrl: './total-sales.component.html'
})
export class TotalSalesComponent {
    @Input() simulationPeriod: string = '';
    @Input() simulationName: string = '';
    @Input() simulationIdentification: string = '';
    @Input() simulation?: any; 

    get totalComprasSection() {
        return {
            sectionTitle: 'TOTAL DE COMPRAS',
            hasToggle: false, 
            toggleState: false,
            onToggle: () => {},
            items: [
                { 
                    label: 'COMPRAS CON IVA SOPORTANDO ACREDITABLE', 
                    value: this.simulation?.comprasIvaAcreditable || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'COMPRA DE BIENES Y SERVICIOS LOCALES', 
                    value: this.simulation?.compraBienesServicios || 0, 
                    isAutocalculated: true 
                }
            ],
            subsections: []
        };
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 2
        }).format(value);
    }
}