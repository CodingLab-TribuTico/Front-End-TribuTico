import { Component, computed, inject } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ChartComponent } from '../../components/chart/chart.component';
import { IManualInvoice } from '../../interfaces';
import { ReportService } from '../../services/report.service';
import { CardReportComponent } from '../../components/card-report/card-report.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ChartComponent, CardReportComponent],
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  public invoiceService: InvoiceService = inject(InvoiceService);
  public reportService: ReportService = inject(ReportService)
  public title: string = "Ingresos";
  public labels: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  public variationType: string = 'months';
  public labelsFlujoCaja: string[] = this.labels;
  public datasetsFlujoCaja: any[] = [];
  public ingresosAndGastos: boolean = false;
  public flujoCaja: boolean = false;
  public gastosCategoria: boolean = false;
  public years: number[] = [];

  public hasGastosIngresosData = computed(() => this.hasInvoiceData('ingresosGastos'));
  public hasFlujoCajaData = computed(() => this.hasInvoiceData('flujoCaja'));
  public hasGastosCategoriaData = computed(() => this.hasInvoiceData('gastosCategoria'));

  constructor() {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    this.invoiceService.getByUserId(userId);

    this.invoiceService.search.size = 0;
    this.invoiceService.search.year = 0;
    this.invoiceService.getAllMonthlyInvoices();
  }

  hasInvoiceData(value: string): boolean {
    if (value == "ingresosGastos") {
      const ingresos = this.invoiceService.invoicesMonthlyGastosIngresos$()[0].data;
      for (const invoice of ingresos) {
        if (invoice > 0) {
          return true;
        }
      }

      const gastos = this.invoiceService.invoicesMonthlyGastosIngresos$()[1].data;
      for (const invoice of gastos) {
        if (invoice > 0) {
          return true;
        }
      }
      return false;
    } else if (value == "flujoCaja") {
      const ingresos = this.invoiceService.invoicesMonthlyGastosIngresos$()[0].data;
      for (const invoice of ingresos) {
        if (invoice > 0) {
          return true;
        }
      }

      const gastos = this.invoiceService.invoicesMonthlyGastosIngresos$()[1].data;
      for (const invoice of gastos) {
        if (invoice > 0) {
          return true;
        }
      }

      const flujoCaja = this.invoiceService.invoicesMonthlyFlujoCaja$()[2].data;
      for (const invoice of flujoCaja) {
        if (invoice > 0) {
          return true;
        }
      }
      return false;
    } else if (value == "gastosCategoria") {
      const gastosCategoria = this.invoiceService.invoicesGastosCategoria$()[0].datasets;
      for (const dataset of gastosCategoria) {
        if (dataset.data.some((value: number) => value > 0)) {
          return true;
        }
      }
      return false;
    }

    return false;
  }

  loadInvoicesYears(invoices: IManualInvoice[] = []) {
    if (invoices.length > 0) {
      const issueDates = invoices
        .filter(invoice => typeof invoice.issueDate === 'string')
        .map(invoice => invoice.issueDate!.split('-')[0]);
      this.years = Array.from(new Set(issueDates.map(date => parseInt(date))));
    }
    return this.years.sort((a, b) => b - a);
  }

  changeYear(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedYear = parseInt(selectElement.value);
    this.invoiceService.search.year = selectedYear;
    this.invoiceService.getAllMonthlyInvoices();
  }

  closeReport(value: string) {
    if (value === 'gastosCategoria') {
      this.gastosCategoria = false;
      this.invoiceService.search.year = 0;
      this.invoiceService.getAllMonthlyInvoices();
    } else if (value === 'ingresosGastos') {
      this.ingresosAndGastos = false;
      this.invoiceService.search.year = 0;
      this.invoiceService.getAllMonthlyInvoices();
    } else if (value === 'flujoCaja') {
      this.flujoCaja = false;
      this.invoiceService.search.year = 0;
      this.invoiceService.getAllMonthlyInvoices();
    }
  }

  toggleVariationType() {
    if (this.variationType === 'months') {
      this.labelsFlujoCaja = ['Trimestre I', 'Trimestre II', 'Trimestre III', 'Trimestre IV'];
      this.variationType = 'trimesters';
      this.datasetsFlujoCaja = this.invoiceService.invoicesTrimestersFlujoCaja$();
    } else {
      this.labelsFlujoCaja = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      this.variationType = 'months';
      this.datasetsFlujoCaja = this.invoiceService.invoicesMonthlyFlujoCaja$();
    }
  }
}
