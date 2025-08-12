import { Component, computed, inject } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';
import { IManualInvoice } from '../../interfaces';
import { CardReportComponent } from '../../components/card-report/card-report.component';
import { ReportUserService } from '../../services/report-user.service';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ChartComponent, CardReportComponent],
  templateUrl: './reports-user.component.html'
})
export class ReportsUserComponent {
  public invoiceService: InvoiceService = inject(InvoiceService);
  public reportUserService: ReportUserService = inject(ReportUserService)
  public labels: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  public variationType: string = 'months';
  public labelsCashFlow: string[] = this.labels;
  public incomesAndExpenses: boolean = false;
  public cashFlow: boolean = false;
  public expenseCategories: boolean = false;
  public years: number[] = [];

  public hasIncomesAndExpensesData = computed(() => this.hasPositiveValues(this.reportUserService.invoicesMonthlyIncomesAndExpenses$()));
  public hasCashFlowData = computed(() => this.hasPositiveValues(this.reportUserService.invoicesMonthlyCashFlow$()));
  public hasExpenseCategoriesData = computed(() => this.hasPositiveValues(this.reportUserService.invoicesTop5ExpenseCategories$()));

  constructor() {
    this.reportUserService.search.year = 0;
    this.invoiceService.getAll();
    this.loadAllReports();
  }

  private loadAllReports() {
    this.reportUserService.getAllIncomeAndExpenses();
    this.reportUserService.getAllMonthlyCashFlow();
    this.reportUserService.getAllTrimesterCashFlow();
    this.reportUserService.getTop5ExpenseCategories();
  }

  private hasPositiveValues(data: any): boolean {
    if (!data) return false;

    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].data)) {
      return data.some(item => item.data.some((value: number) => value > 0));
    }

    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].datasets)) {
      return data[0].datasets.some((ds: { data: number[] }) => ds.data.some(v => v > 0));
    }

    if (Array.isArray(data)) {
      return data.some((value: number) => value > 0);
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
    const year = parseInt((event.target as HTMLSelectElement).value);
    this.reportUserService.search.year = year;
    this.loadAllReports();
  }

  closeReport(reportType: 'incomesAndExpenses' | 'cashFlow' | 'expenseCategories') {
    this[reportType] = false;
    this.reportUserService.search.year = 0;
    this.loadAllReports();
  }

  toggleVariationType() {
    const isMonthly = this.variationType === 'months';
    this.variationType = isMonthly ? 'trimesters' : 'months';
    this.labelsCashFlow = isMonthly
      ? ['Trimestre I', 'Trimestre II', 'Trimestre III', 'Trimestre IV']
      : [...this.labels];
  }
}
