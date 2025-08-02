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
            sectionTitle: 'TOTAL DE COMPRAS E IVA LIQUIDADO',
            hasToggle: false, 
            toggleState: false,
            onToggle: () => {},
            items: [
                { 
                    label: 'IVA COMPRAS BIENES', 
                    value: this.simulation?.ivaComprasBienes || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'IVA COMPRAS SERVICIOS', 
                    value: this.simulation?.ivaComprasServicios || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'IVA IMPORTACIONES', 
                    value: this.simulation?.ivaImportaciones || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'IVA GASTOS GENERALES', 
                    value: this.simulation?.ivaGastosGenerales || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'IVA ACTIVOS FIJOS', 
                    value: this.simulation?.ivaActivosFijos || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'TOTAL IVA CRÉDITO', 
                    value: this.simulation?.totalIvaCredito || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'TOTAL IVA DÉBITO', 
                    value: this.simulation?.totalIvaDebito || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'IVA NETO A PAGAR', 
                    value: this.simulation?.ivaNetoPorPagar || 0, 
                    isAutocalculated: true 
                },
                { 
                    label: 'IVA A FAVOR', 
                    value: this.simulation?.ivaAFavor || 0, 
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