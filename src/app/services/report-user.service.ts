import { inject, Injectable, signal } from '@angular/core';
import { IResponse, ISearch } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ReportUserService extends BaseService<IResponse<any>> {
  protected override source: string = 'reports-user';
  private alertService: AlertService = inject(AlertService);
  private invoicesMonthlyIncomesAndExpenses = signal<any[]>([]);
  private invoicesMonthlyCashFlow = signal<any[]>([]);
  private invoicesTrimesterCashFlow = signal<any[]>([]);
  private invoicesTop5ExpenseCategories = signal<any[]>([]);

  public categories: Record<string, string> = {
    "VG-B": "Venta Gravada de Bienes (13%)",
    "VG-S": "Venta Gravada de Servicios (13%)",
    "VE": "Venta Exenta (Ley u oficio)",
    "VX": "Venta Exonerada (usuario final exonerado)",
    "EXP": "Exportación de Bienes o Servicios",
    "CBG": "Compra de Bienes Gravados",
    "CSG": "Compra de Servicios Gravados",
    "CX": "Compra Exenta o Exonerada",
    "CBR": "Compra de Bienes con Tarifa Reducida",
    "CSR": "Compra de Servicios con Tarifa Reducida",
    "GSP": "Gasto de Servicios Públicos",
    "GA": "Gasto Administrativo",
    "SPS": "Servicios Profesionales Subcontratados",
    "HP": "Honorarios Profesionales",
    "GV": "Gasto de Transporte o Viáticos",
    "PP": "Publicidad y Promoción",
    "ALO": "Alquiler de Local u Oficina",
    "MR": "Mantenimiento y Reparaciones",
    "CAF": "Compra de Activos Fijos",
    "GF": "Gasto Financiero",
    "GS": "Gasto Salarial",
    "NCE": "Notas de Crédito Emitidas",
    "NCR": "Notas de Crédito Recibidas",
    "DON": "Donación Deducible",
    "MUL": "Multas, Sanciones o Gastos No Deducibles"
  };

  get invoicesMonthlyIncomesAndExpenses$() {
    return this.invoicesMonthlyIncomesAndExpenses;
  }

  get invoicesMonthlyCashFlow$() {
    return this.invoicesMonthlyCashFlow;
  }

  get invoicesTrimesterCashFlow$() {
    return this.invoicesTrimesterCashFlow;
  }

  get invoicesTop5ExpenseCategories$() {
    return this.invoicesTop5ExpenseCategories;
  }

  public search: ISearch = {
    year: 0
  };

  private mapObjectToArray(dataObj: Record<string, number>): number[] {
    return Object.keys(dataObj)
      .sort((a, b) => Number(a) - Number(b))
      .map(key => dataObj[key]);
  }

  getAllIncomeAndExpenses() {
    this.findAllWithParamsAndCustomSource("income-and-expenses", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any>) => {
        const incomes = this.mapObjectToArray(response.data.income);
        const expenses = this.mapObjectToArray(response.data.expenses);

        this.invoicesMonthlyIncomesAndExpenses.set([
          {
            label: "Ingresos",
            data: incomes,
            backgroundColor: '#4A403D'
          },
          {
            label: "Gastos",
            data: expenses,
            backgroundColor: '#EA804C'
          }
        ]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió al obtener ingresos y gastos mensuales');
      },
    });
  }

  getAllMonthlyCashFlow() {
    this.findAllWithParamsAndCustomSource("monthly-cash-flow", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any>) => {
        const incomes = this.mapObjectToArray(response.data.income);
        const expenses = this.mapObjectToArray(response.data.expenses);
        const cashFlow = this.mapObjectToArray(response.data.cashFlow);

        this.invoicesMonthlyCashFlow.set([
          {
            label: "Ingresos",
            data: incomes,
            backgroundColor: '#3E885B',
            borderColor: '#3E885B',
            borderWidth: 2,
          },
          {
            label: "Gastos",
            data: expenses,
            backgroundColor: '#8B2F25',
            borderColor: '#8B2F25',
            borderWidth: 2,
          },
          {
            label: "Flujo de Caja",
            data: cashFlow,
            backgroundColor: '#4A403D',
            borderColor: '#4A403D',
            borderWidth: 2,
          }
        ]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió al obtener el flujo de caja mensual');
      },
    });
  }

  getAllTrimesterCashFlow() {
    this.findAllWithParamsAndCustomSource("trimester-cash-flow", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any>) => {
        const incomes = this.mapObjectToArray(response.data.income);
        const expenses = this.mapObjectToArray(response.data.expenses);
        const cashFlow = this.mapObjectToArray(response.data.cashFlow);

        this.invoicesTrimesterCashFlow.set([
          {
            label: "Ingresos",
            data: incomes,
            backgroundColor: '#3E885B',
            borderColor: '#3E885B',
            borderWidth: 2,
          },
          {
            label: "Gastos",
            data: expenses,
            backgroundColor: '#8B2F25',
            borderColor: '#8B2F25',
            borderWidth: 2,
          },
          {
            label: "Flujo de Caja",
            data: cashFlow,
            backgroundColor: '#4A403D',
            borderColor: '#4A403D',
            borderWidth: 2,
          }
        ]);
      },
      error: (err: any) => {
        console.error("error", err);
      },
    });
  }

  getTop5ExpenseCategories() {
    this.findAllWithParamsAndCustomSource("top-expense-categories", {
      year: this.search.year,
    }).subscribe({
      next: (response: IResponse<any[]>) => {
        const top5 = response.data;
        const labels = top5.map(item => this.categories[item.category] ?? item.category);
        const data = top5.map(item => item.total);
        const colors = ['#B5473A', '#FACF7D', '#EA804C', '#FFF1C1', '#4A403D'];

        this.invoicesTop5ExpenseCategories.set([{
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: colors.slice(0, labels.length)
            }
          ]
        }]);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener top 5 categorías de gastos');
      },
    });
  }
}