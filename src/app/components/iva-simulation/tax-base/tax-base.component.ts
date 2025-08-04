import { Component, Input } from '@angular/core';
import { SectionIvaSimulationComponent } from '../section-iva-simulation/section-iva-simulation.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tax-base',
    standalone: true,
    imports: [SectionIvaSimulationComponent, CommonModule],
    templateUrl: './tax-base.component.html'
})
export class TaxBaseComponent {
    @Input() simulationPeriod: string = '';
    @Input() simulationName: string = '';
    @Input() simulationIdentification: string = '';
    @Input() simulation?: any; 

    taxBaseEnabled: boolean = false;

    toggleTaxBase = (value: boolean) => {
        this.taxBaseEnabled = value;
    }

    get taxBaseItems() {
        return {
            sectionTitle: 'SUBTOTAL OTROS RUBROS A INCLUIR EN LA BASE IMPONIBLE',
            hasToggle: true,
            toggleState: this.taxBaseEnabled,
            onToggle: this.toggleTaxBase,
            items: [],
            tableData: {
                headers: ['DETALLE', '13%', '8%', '4%', '2%', '1%', '0.5%'],
                rows: [
                    'INCREMENTO EN LA BASE IMPONIBLE POR RECAUDACIÓN A NIVEL DE MAYORISTA, IMPORTADOR Y FABRICANTE',
                    'DEVOLUCIONES A PROVEEDORES',
                    'SERVICIOS A PROVEEDORES',
                    'SERVICIOS ADQUIRIDOS DESDE EL EXTERIOR'
                ],
                values: [
                    {
                        '13%': this.simulation?.incrementoBase13 || 0,
                        '8%': this.simulation?.incrementoBase8 || 0,
                        '4%': this.simulation?.incrementoBase4 || 0,
                        '2%': this.simulation?.incrementoBase2 || 0,
                        '1%': this.simulation?.incrementoBase1 || 0,
                        '0.5%': this.simulation?.incrementoBase05 || 0
                    },
                    {
                        '13%': this.simulation?.devolucionesProveedores13 || 0,
                        '8%': this.simulation?.devolucionesProveedores8 || 0,
                        '4%': this.simulation?.devolucionesProveedores4 || 0,
                        '2%': this.simulation?.devolucionesProveedores2 || 0,
                        '1%': this.simulation?.devolucionesProveedores1 || 0,
                        '0.5%': this.simulation?.devolucionesProveedores05 || 0
                    },
                    {
                        '13%': this.simulation?.serviciosProveedores13 || 0,
                        '8%': this.simulation?.serviciosProveedores8 || 0,
                        '4%': this.simulation?.serviciosProveedores4 || 0,
                        '2%': this.simulation?.serviciosProveedores2 || 0,
                        '1%': this.simulation?.serviciosProveedores1 || 0,
                        '0.5%': this.simulation?.serviciosProveedores05 || 0
                    },
                    {
                        '13%': this.simulation?.serviciosExterior13 || 0,
                        '8%': this.simulation?.serviciosExterior8 || 0,
                        '4%': this.simulation?.serviciosExterior4 || 0,
                        '2%': this.simulation?.serviciosExterior2 || 0,
                        '1%': this.simulation?.serviciosExterior1 || 0,
                        '0.5%': this.simulation?.serviciosExterior05 || 0
                    }
                ]
            }
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