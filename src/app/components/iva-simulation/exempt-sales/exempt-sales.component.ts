import { Component, Input } from '@angular/core';
import { SectionIvaSimulationComponent } from '../section-iva-simulation/section-iva-simulation.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-exempt-sales',
    standalone: true,
    imports: [SectionIvaSimulationComponent, CommonModule],
    templateUrl: './exempt-sales.component.html'
})
export class ExemptSalesComponent {
    @Input() simulationPeriod: string = '';
    @Input() simulationName: string = '';
    @Input() simulationIdentification: string = '';
    @Input() simulation?: any; 

    exemptSalesEnabled: boolean = false;

    toggleExemptSales = (value: boolean) => {
        this.exemptSalesEnabled = value;
    }

    get exemptSalesItems() {
        return {
            sectionTitle: 'VENTAS EXENTAS (ART 8)',
            hasToggle: true,
            toggleState: this.exemptSalesEnabled,
            onToggle: this.toggleExemptSales,
            items: [],
            tableData: {
                headers: ['DETALLE', 'MONTO'],
                rows: [
                    'EXPORTACIÓN DE SERVICIOS',
                    'VENTA LOCAL DE BIENES',
                    'SERVICIOS PRESTACIONES A NIVEL LOCAL',
                    'CRÉDITOS PARA DESCUENTO DE FACTURAS Y ARRENDAMIENTOS FINANCIEROS U OPERATIVOS EN FUNCIÓN FINANCIERA',
                    'ARRENDAMIENTOS DESTINADOS A LA VIVIENDA',
                    'ARRENDAMIENTOS UTILIZADOS POR MICRO Y PEQUEÑAS EMPRESAS',
                    'SUMINISTRO DE ENERGÍA ELÉCTRICA RESIDENCIAL NO MAYOR A 280 KWH',
                    'VENTA O ENTREGA DE AGUA RESIDENCIAL NO MAYOR A 30 METROS CÚBICOS',
                    'AUTOCONSUMO DE BIENES Y SERVICIOS SIN APLICACIÓN PREVIA DE MANERA TOTAL O PARCIAL O CRÉDITOS',
                    'VENTA DE SILLAS DE RUEDAS Y SIMILARES, EQUIPO ORTOPÉDICO Y EQUIPO MÉDICO',
                    'VENTA DE BIENES Y SERVICIOS DESTINADOS A LA EDUCACIÓN',
                    'ARANCELES POR MATRÍCULA Y CRÉDITOS DE CURSOS EN UNIVERSIDADES PÚBLICAS Y SERVICIOS DE EDUCACIÓN'
                ],
                values: [
                    // Fila 1: EXPORTACIÓN DE SERVICIOS
                    { 'MONTO': this.simulation?.exportServices || 0 },
                    // Fila 2: VENTA LOCAL DE BIENES
                    { 'MONTO': this.simulation?.localSaleGoods || 0 },
                    // Fila 3: SERVICIOS PRESTACIONES A NIVEL LOCAL
                    { 'MONTO': this.simulation?.localServices || 0 },
                    // Fila 4: CRÉDITOS PARA DESCUENTO DE FACTURAS
                    { 'MONTO': this.simulation?.invoiceDiscountCredits || 0 },
                    // Fila 5: ARRENDAMIENTOS DESTINADOS A LA VIVIENDA
                    { 'MONTO': this.simulation?.housingLeases || 0 },
                    // Fila 6: ARRENDAMIENTOS UTILIZADOS POR MICRO Y PEQUEÑAS EMPRESAS
                    { 'MONTO': this.simulation?.microEnterpriseLeases || 0 },
                    // Fila 7: SUMINISTRO DE ENERGÍA ELÉCTRICA RESIDENCIAL
                    { 'MONTO': this.simulation?.residentialElectricity || 0 },
                    // Fila 8: AGUA RESIDENCIAL
                    { 'MONTO': this.simulation?.residentialWater || 0 },
                    // Fila 9: AUTOCONSUMO
                    { 'MONTO': this.simulation?.selfConsumption || 0 },
                    // Fila 10: SILLAS DE RUEDAS Y EQUIPO MÉDICO
                    { 'MONTO': this.simulation?.medicalEquipment || 0 },
                    // Fila 11: SERVICIOS EDUCATIVOS
                    { 'MONTO': this.simulation?.educationalServices || 0 },
                    // Fila 12: ARANCELES UNIVERSITARIOS
                    { 'MONTO': this.simulation?.universityTuition || 0 }
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