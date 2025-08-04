import { Component, computed, inject } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';
import { CardReportComponent } from '../../components/card-report/card-report.component';
import { IManualInvoice, IUser } from '../../interfaces';
import { ReportAdminService } from '../../services/report-admin.service';
import { UserService } from '../../services/user.service';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-reports-admin',
  standalone: true,
  imports: [ChartComponent, CardReportComponent],
  templateUrl: './reports-admin.component.html',
})
export class ReportsAdminComponent {
  public userService: UserService = inject(UserService);
  public reportAdminService = inject(ReportAdminService);
  public invoiceService = inject(InvoiceService);
  public systemUsers: boolean = false;
  public processedInvoices: boolean = false;
  public incomeAndExpenses: boolean = false;
  public years: number[] = [];

  public labels: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  public hasRegisteredMonthlyUsers = computed(() => this.hasPositiveValues(this.reportAdminService.registeredMonthlyUsers$()));
  public hasUserStatusProportion = computed(() => this.hasPositiveValues(this.reportAdminService.userStatusProportion$()));
  public hasMonthlyVolumeInvoices = computed(() => this.hasPositiveValues(this.reportAdminService.monthlyVolumeInvoices$()));
  public hasProportionTotalIncomeAndExpenses = computed(() => this.hasPositiveValues(this.reportAdminService.proportionTotalIncomeAndExpenses$()))
  public hasTop10HighestUsersVolumeInvoices = computed(() => this.hasPositiveValues(this.reportAdminService.top10HighestUsersVolumeInvoices$()));

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

  constructor() {
    this.reportAdminService.search.year = 0;
    this.loadAllReports();
    this.userService.getAll();
    this.invoiceService.getAll();
  }

  loadUsersYears(invoices: IUser[] = []) {
    if (invoices.length > 0) {
      const createdAt = invoices
        .filter(invoice => typeof invoice.createdAt === 'string')
        .map(invoice => invoice.createdAt!.split('-')[0]);
      this.years = Array.from(new Set(createdAt.map(date => parseInt(date))));
    }
    return this.years.sort((a, b) => b - a);
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

  closeReport(reportType: 'systemUsers' | 'processedInvoices' | 'incomeAndExpenses') {
    this[reportType] = false;
    this.reportAdminService.search.year = 0;
    this.loadAllReports();
  }

  private loadAllReports() {
    this.reportAdminService.getAllRegisteredMonthlyUsers();
    this.reportAdminService.getAllUserStatusProportion();
    this.reportAdminService.getAllMonthlyVolumeInvoices();
    this.reportAdminService.getAllProportionTotalIncomeAndExpenses();
    this.reportAdminService.getAllTop10HighestUsersVolumeInvoices();
  }

  changeYear(event: Event, reportType: string) {
    const year = +(event.target as HTMLSelectElement).value;

    switch (reportType) {
      case 'registeredMonthlyUsers':
        this.reportAdminService.search.year = year;
        this.reportAdminService.getAllRegisteredMonthlyUsers();
        break;
      case 'monthlyVolumeInvoices':
        this.reportAdminService.search.year = year;
        this.reportAdminService.getAllMonthlyVolumeInvoices();
        break;
      case 'proportionTotalIncomeAndExpenses':
        this.reportAdminService.search.year = year;
        this.reportAdminService.getAllProportionTotalIncomeAndExpenses();
        break;
    }
  }
}
