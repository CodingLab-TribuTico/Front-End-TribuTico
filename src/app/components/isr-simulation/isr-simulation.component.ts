import { Component, Input } from '@angular/core';
import { SectionIsrSimulationComponent } from './section-isr-simulation/section-isr-simulation.component';

@Component({
  selector: 'app-isr-simulation',
  standalone: true,
  imports: [SectionIsrSimulationComponent],
  templateUrl: './isr-simulation.component.html',
})
export class IsrSimulationComponent {
  // I. Datos generales
  @Input() simulationPeriod: string = '';         // Periodo de la simulación (e.g., 2023)
  @Input() simulationName: string = '';           // Nombre del usuario
  @Input() simulationIdentification: string = ''; // Identificación del usuario (e.g., número de cédula)

  // I. Activos y pasivos
  @Input() currentAssets: number = 0;         // 20 - Efectivo, bancos, etc.
  @Input() equityInvestments: number = 0;     // 21 - Acciones y aportes
  @Input() inventory: number = 0;             // 22 - Inventarios
  @Input() netFixedAssets: number = 0;        // 23 - Activos fijos netos
  @Input() totalNetAssets: number = 0;        // 24 - Total activo neto
  @Input() totalLiabilities: number = 0;      // 25 - Total pasivo
  @Input() netEquity: number = 0;             // 26 - Capital neto

  get activesAndLiabilitiesItems() {
    return [
      { label: '20 - Efectivo, bancos, inversiones transitorias, documentos y cuentas por cobrar', value: this.currentAssets, isAutocalculated: false },
      { label: '21 - Acciones y aportes en sociedas', value: this.equityInvestments, isAutocalculated: false },
      { label: '22 - Inventarios', value: this.inventory, isAutocalculated: false },
      { label: '23 - Activos fijos (descuente la depreciacion acumulada)', value: this.netFixedAssets, isAutocalculated: false },
      { label: '24 - Total activo neto (autocalculado)', value: this.totalNetAssets, isAutocalculated: true },
      { label: '25 - Total pasivo', value: this.totalLiabilities, isAutocalculated: false },
      { label: '26 - Capital neto (autocalculado)', value: this.netEquity, isAutocalculated: true },
    ];
  }
  // II. Ingresos y gastos
  @Input() salesRevenue: number = 0;                  // 27 - Venta de bienes y servicios, excepto los servicios profesionales
  @Input() professionalFees: number = 0;              // 28 - Servicios profesionales y honorarios
  @Input() commissions: number = 0;                   // 29 - Comisiones
  @Input() interestsAndYields: number = 0;            // 30 - Intereses y rendimientos
  @Input() dividendsAndShares: number = 0;            // 31 - Dividendos y participaciones
  @Input() rents: number = 0;                         // 32 - Alquileres
  @Input() otherIncome: number = 0;                   // 33 - Otros ingresos diferentes a los anteriores
  @Input() nonTaxableIncome: number = 0;              // 34 - Ingresos no gravables incluidos dentro de los anteriores
  @Input() grossIncomeTotal: number = 0;              // 35 - Total de renta bruta (autocalculado)

  get incomesAndExpensesItems() {
    return [
      { label: '27 - Venta de bienes y servicios, excepto los servicios profesionales', value: this.salesRevenue, isAutocalculated: false },
      { label: '28 - Servicios profesionales y honorarios', value: this.professionalFees, isAutocalculated: false },
      { label: '29 - Comisiones', value: this.commissions, isAutocalculated: false },
      { label: '30 - Intereses y rendimientos', value: this.interestsAndYields, isAutocalculated: false },
      { label: '31 - Dividendos y participaciones', value: this.dividendsAndShares, isAutocalculated: false },
      { label: '32 - Alquileres', value: this.rents, isAutocalculated: false },
      { label: '33 - Otros ingresos diferentes a los anteriores', value: this.otherIncome, isAutocalculated: false },
      { label: '34 - Ingresos no gravables incluidos dentro de los anteriores', value: this.nonTaxableIncome, isAutocalculated: false },
      { label: '35 - Total de renta bruta (autocalculado)', value: this.grossIncomeTotal, isAutocalculated: true },
    ];
  }

  // III. Costos, gastos y deducciones
  @Input() initialInventory: number = 0;               // 36 - Inventario
  @Input() purchases: number = 0;                      // 37 - Compras
  @Input() finalInventory: number = 0;                 // 38 - Inventario
  @Input() costOfGoodsSold: number = 0;                // 39 - Costo de ventas
  @Input() financialExpenses: number = 0;              // 40 - Intereses
  @Input() administrativeExpenses: number = 0;         // 41 - Gastos de ventas y administrativos
  @Input() depreciationAndAmortization: number = 0;    // 42 - Depreciación, amortización y agotamiento
  @Input() pensionContributions: number = 0;           // 43 - Aportes de regimenes voluntarios de pensiones complementias
  @Input() otherAllowableDeductions: number = 0;       // 44 - Otros costos, gastos y deducciones permitidos por la ley
  @Input() totalAllowableDeductions: number = 0;       // 45 - Total de costos, gastos y deducciones permitidos por la ley (autocalculado)

  get costsAndDeductionsItems() {
    return [
      { label: '36 - Inventario inicial', value: this.initialInventory, isAutocalculated: false },
      { label: '37 - Compras', value: this.purchases, isAutocalculated: false },
      { label: '38 - Inventario final', value: this.finalInventory, isAutocalculated: false },
      { label: '39 - Costo de ventas', value: this.costOfGoodsSold, isAutocalculated: false },
      { label: '40 - Intereses y gastos financieros', value: this.financialExpenses, isAutocalculated: false },
      { label: '41 - Gastos de ventas y administrativos', value: this.administrativeExpenses, isAutocalculated: false },
      { label: '42 - Depreciación, amortización y agotamiento', value: this.depreciationAndAmortization, isAutocalculated: false },
      { label: '43 - Aportes de regimenes voluntarios de pensiones complementias (Max 10% renta bruta)', value: this.pensionContributions, isAutocalculated: false },
      { label: '44 - Otros costos, gastos y deducciones permitidos por la ley', value: this.otherAllowableDeductions, isAutocalculated: false },
      { label: '45 - Total de costos, gastos y deducciones permitidos por la ley (autocalculado)', value: this.totalAllowableDeductions, isAutocalculated: true }
    ];
  }

  // IV. Base imponible
  @Input() netTaxableIncome: number = 0;                // 46 - Renta neta (autocalculado)
  @Input() nonTaxableSalaryAmount: number = 0;          // 46 (bis) - Monto no sujeto aplicado al impuesto al salario (acumulado anual)
  @Input() incomeTax: number = 0;                       // 47 - Impuesto sobre la renta (autocalculado)
  @Input() freeTradeZoneExemption: number = 0;          // 51 - Exoneración de zona franca
  @Input() otherExemptions: number = 0;                 // 53 - Exoneración de otros conceptos
  @Input() netIncomeTaxAfterExemptions: number = 0;     // 54 - Impuesto sobre la renta después de exoneraciones (autocalculado)

  get taxableBaseItems() {
    return [
      { label: '46 - Renta neta (autocalculado)', value: this.netTaxableIncome, isAutocalculated: true },
      { label: '46 (bis) - Monto no sujeto aplicado al impuesto al salario (acumulado anual)', value: this.nonTaxableSalaryAmount, isAutocalculated: false },
      { label: '47 - Impuesto sobre la renta (autocalculado)', value: this.incomeTax, isAutocalculated: true },
      { label: '51 - Exoneración de zona franca', value: this.freeTradeZoneExemption, isAutocalculated: false },
      { label: '53 - Exoneración de otros conceptos', value: this.otherExemptions, isAutocalculated: false },
      { label: '54 - Impuesto sobre la renta después de exoneraciones (autocalculado)', value: this.netIncomeTaxAfterExemptions, isAutocalculated: true }
    ];
  }

  // V. Creditos
  @Input() familyCredit: number = 0;                   // 58 - Crédito familiar (solo personas físicas)
  @Input() otherCredits: number = 0;                    // 59 - Otros créditos
  @Input() periodTax: number = 0;                       // 60 - Impuesto del periodo (autocalculado)
  @Input() twoPercentWithholdings: number = 0;          // 61 - Retenciones 2%
  @Input() otherWithholdings: number = 0;               // 62 - Otras retenciones
  @Input() partialPayments: number = 0;                 // 63 - Pagos parciales
  @Input() totalNetTax: number = 0;                     // 64 - Total

  get creditsItems() {
    return [
      { label: '58 - Crédito familiar (solo personas físicas)', value: this.familyCredit, isAutocalculated: false },
      { label: '59 - Otros créditos', value: this.otherCredits, isAutocalculated: false },
      { label: '60 - Impuesto del periodo (autocalculado)', value: this.periodTax, isAutocalculated: true },
      { label: '61 - Retenciones 2%', value: this.twoPercentWithholdings, isAutocalculated: false },
      { label: '62 - Otras retenciones', value: this.otherWithholdings, isAutocalculated: false },
      { label: '63 - Pagos parciales', value: this.partialPayments, isAutocalculated: false },
      { label: '64 - Total impuesto neto (autocalculado)', value: this.totalNetTax, isAutocalculated: true }
    ];
  }

  // VI. Liquidacion deuda tributaria
  @Input() interests: number = 0;                        // 82 - Intereses (autocalculado)
  @Input() totalTaxDebt: number = 0;                     // 83 - Total
  @Input() requestedCompensation: number = 0;            // 84 - Solicito compensar con créditos a mi favor por el monto de
  @Input() totalDebtToPay: number = 0;                    // 85 - Total deuda por pagar

  get taxDebtSettlementItems() {
    return [
      { label: '82 - Intereses (autocalculado)', value: this.interests, isAutocalculated: true },
      { label: '83 - Total deuda tributaria (autocalculado)', value: this.totalTaxDebt, isAutocalculated: true },
      { label: '84 - Solicito compensar con créditos a mi favor por el monto de', value: this.requestedCompensation, isAutocalculated: false },
      { label: '85 - Total deuda por pagar (autocalculado)', value: this.totalDebtToPay, isAutocalculated: true }
    ];
  }
}
