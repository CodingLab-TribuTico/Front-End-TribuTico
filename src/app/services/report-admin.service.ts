import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ReportAdminService extends BaseService<IResponse<any>> {
  protected override source: string = 'reports-admin';
  private alertService: AlertService = inject(AlertService);
  private registeredMonthlyUsers = signal<any[]>([]);
  private userStatusProportion = signal<any[]>([]);
  private monthlyVolumeInvoices = signal<any[]>([]);
  private proportionTotalIncomeAndExpenses = signal<any[]>([]);
  private top10HighestUsersVolumeInvoices = signal<any[]>([]);
  private top10UsersByInvoiceCount = signal<any[]>([]);
  private monthlyIncomeExpenses = signal<any[]>([]);
  private top10UsersByBalance = signal<any[]>([]);

  get registeredMonthlyUsers$() {
    return this.registeredMonthlyUsers;
  }

  get userStatusProportion$() {
    return this.userStatusProportion;
  }

  get monthlyVolumeInvoices$() {
    return this.monthlyVolumeInvoices;
  }

  get proportionTotalIncomeAndExpenses$() {
    return this.proportionTotalIncomeAndExpenses;
  }

  get top10HighestUsersVolumeInvoices$() {
    return this.top10HighestUsersVolumeInvoices;
  }

  get top10UsersByInvoiceCount$() {
    return this.top10UsersByInvoiceCount;
  }

  get monthlyIncomeExpenses$() {
    return this.monthlyIncomeExpenses;
  }

  get top10UsersByBalance$() {
    return this.top10UsersByBalance;
  }

  public search: ISearch = {
    year: 0
  };

  private generateMonthlyData(monthlyData: any, data: any): number[] {
    for (let month = 1; month <= 12; month++) {
      monthlyData[month - 1] = data[month] ?? 0;
    }
    return monthlyData;
  }

  getAllRegisteredMonthlyUsers() {
    this.findAllWithParamsAndCustomSource("registered-users", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any[]>) => {
        const monthlyData = this.generateMonthlyData([], response.data);

        this.registeredMonthlyUsers.set([
          {
            label: "Usuarios registrados",
            data: monthlyData,
            backgroundColor: '#FACF7D',
          },
        ]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener usuarios registrados mensualmente');
      },
    });
  }

  getAllUserStatusProportion() {
    this.findAllWithParamsAndCustomSource("status-proportion").subscribe({
      next: (response: IResponse<any>) => {
        const proportion = response.data;

        const labels = ['Activos', 'Bloqueados', 'Deshabilitados'];
        const colors = ['#EA804C', '#B5473A', '#FACF7D'];

        this.userStatusProportion.set([{
          labels: labels,
          datasets: [
            {
              data: [proportion.active ?? 0, proportion.blocked ?? 0, proportion.disabled ?? 0],
              backgroundColor: colors,
            }
          ]
        }]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener proporción de usuarios por estado');
      },
    });
  }

  getAllMonthlyVolumeInvoices() {
    this.findAllWithParamsAndCustomSource("volume-invoices", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any[]>) => {
        const monthlyData = this.generateMonthlyData([], response.data);

        this.monthlyVolumeInvoices.set([
          {
            label: "Volumen de facturas",
            data: monthlyData,
            backgroundColor: '#FACF7D',
          },
        ]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener el volumen de facturas mensuales');
      },
    });
  }

  getAllProportionTotalIncomeAndExpenses() {
    this.findAllWithParamsAndCustomSource("proportion-income-expenses", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any>) => {
        const data = response.data;
        const labels = ['Ingresos', 'Gastos'];
        const colors = ['#EA804C', '#FACF7D'];

        this.proportionTotalIncomeAndExpenses.set([{
          labels: labels,
          datasets: [
            {
              data: [
                data.totalIncomes ?? 0,
                data.totalExpenses ?? 0
              ],
              backgroundColor: colors,
            }
          ]
        }]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener la proporción de ingresos y gastos');
      },
    });
  }

  getAllTop10HighestUsersVolumeInvoices() {
    this.findAllWithParamsAndCustomSource("top-users-invoice-volume", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any[]>) => {
        const topUsers = response.data;

        const labels = topUsers.map(user => `${user.name} ${user.lastname}`);

        const incomeData = topUsers.map(user => user.totalIncome ?? 0);
        const expensesData = topUsers.map(user => user.totalExpenses ?? 0);

        this.top10HighestUsersVolumeInvoices.set([{
          labels: labels,
          datasets: [
            {
              label: 'Ingresos',
              data: incomeData,
              backgroundColor: '#FACF7D',
            },
            {
              label: 'Gastos',
              data: expensesData,
              backgroundColor: '#EA804C',
            }
          ]
        }]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener los 10 usuarios de mayor volumen de facturación');
      },
    });
  }

  getAllTop10UsersByInvoiceCount() {
    this.findAllWithParamsAndCustomSource("top-users-invoice-volume", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any[]>) => {
        const topUsers = response.data;

        const labels = topUsers.map(user => `${user.name} ${user.lastname}`);
        const countData = topUsers.map(user => user.totalCountInvoices ?? 0);

        this.top10UsersByInvoiceCount.set([{
          labels: labels,
          datasets: [
            {
              label: 'Cantidad de Facturas',
              data: countData,
              backgroundColor: '#FACF7D',
            }
          ]
        }]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener los 10 usuarios con más facturas emitidas');
      },
    });
  }

  getAllMonthlyIncomeAndExpenses() {
    this.findAllWithParamsAndCustomSource("monthly-income-expenses", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any>) => {
        const incomeData: number[] = Array(12).fill(0);
        const expensesData: number[] = Array(12).fill(0);
        const dataObj = response.data;

        for (let month = 1; month <= 12; month++) {
          incomeData[month - 1] = dataObj[month]?.income ?? 0;
          expensesData[month - 1] = dataObj[month]?.expenses ?? 0;
        }

        this.monthlyIncomeExpenses.set([
          {
            label: "Ingresos",
            data: incomeData,
            backgroundColor: 'rgba(250, 207, 125, 0.2)',
            borderColor: '#FACF7D',
            borderWidth: 2,
            fill: {
              target: 'origin',
              above: 'rgba(250, 207, 125, 0.2)',
            },
          },
          {
            label: "Gastos",
            data: expensesData,
            backgroundColor: 'rgba(234, 128, 76, 0.2)',
            borderColor: '#EA804C',
            borderWidth: 2,
            fill: {
              target: 'origin',
              above: 'rgba(234, 128, 76, 0.2)',
            },
          },
        ]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener los ingresos y gastos mensuales');
      },
    });
  }

  getTop10UsersByBalance() {
    this.findAllWithParamsAndCustomSource("top-users-balance", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any[]>) => {
        const users = response.data;

        const labels = users.map(user => `${user.name} ${user.lastname}`);
        const balances = users.map(user => user.balance ?? 0);

        this.top10UsersByBalance.set([{
          labels: labels,
          datasets: [
            {
              label: 'Balance (Ingresos - Gastos)',
              data: balances,
              backgroundColor: balances.map(value => value >= 0 ? '#FACF7D' : '#EA804C'),
            }
          ]
        }]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener el balance de los usuarios');
      }
    });
  }
}
