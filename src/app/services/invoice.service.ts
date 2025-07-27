import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IResponse, ISearch, IManualInvoice } from "../interfaces";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: "root",
})
export class InvoiceService extends BaseService<IManualInvoice> {
  protected override source: string = 'invoices';
  private invoicesList = signal<IManualInvoice[]>([]);
  private currentInvoice = signal<IManualInvoice | null>(null);
  private invoicesByUserIdList = signal<IManualInvoice[]>([]);
  private invoicesMonthlyGastosIngresos = signal<any[]>([]);
  private invoicesMonthlyFlujoCaja = signal<any[]>([]);
  private invoicesTrimestersFlujoCaja = signal<any[]>([]);
  private invoicesGastosCategoria = signal<any[]>([]);
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

  get invoices$() {
    return this.invoicesList;
  }

  get invoicesMonthlyGastosIngresos$() {
    return this.invoicesMonthlyGastosIngresos;
  }

  get invoicesMonthlyFlujoCaja$() {
    return this.invoicesMonthlyFlujoCaja;
  }

  get invoicesTrimestersFlujoCaja$() {
    return this.invoicesTrimestersFlujoCaja;
  }

  get invoicesGastosCategoria$() {
    return this.invoicesGastosCategoria;
  }

  get currentInvoice$() {
    return this.currentInvoice;
  }

  get invoicesByUserId$() {
    return this.invoicesByUserIdList;
  }

  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
    year: 0
  };

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({
      page: this.search.page,
      size: this.search.size,
      search: this.search.search,
    }).subscribe({
      next: (response: IResponse<IManualInvoice[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.invoicesList.set(response.data);
      },
      error: (err: any) => {
        console.error("error", err);
      },
    });
  }

  getAllMonthlyInvoices() {
    this.findAllWithParams({
      page: this.search.page,
      size: this.search.size,
      search: this.search.search,
      year: this.search.year
    }).subscribe({
      next: (response: IResponse<IManualInvoice[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.invoicesMonthlyGastosIngresos.set(this.getMonthlyDataset(response.data));
        this.invoicesMonthlyFlujoCaja.set(this.getMonthlyFlujoCajaDataset(response.data));
        this.invoicesTrimestersFlujoCaja.set(this.getTrimestersFlujoCajaDataset(response.data));
        this.invoicesGastosCategoria.set([this.getGastoCategoriaDataset(response.data)]);
        console.log("invoicesGastosCategoria", this.invoicesGastosCategoria()[0].datasets);
      },
      error: (err: any) => {
        console.error("error", err);
      },
    });
  }

  getById(id: number) {
    this.find(id).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        this.currentInvoice.set(response.data);
      },
      error: (err: any) => {
        console.error("error", err);
      },
    });
  }

  getByUserId(userId: number) {
    this.findAllWithParams({ userId: userId }).subscribe({
      next: (response: IResponse<IManualInvoice[]>) => {
        this.invoicesByUserIdList.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  save(item: IManualInvoice) {
    this.add(item).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        this.alertService.displayAlert(
          "success",
          response.message || 'Factura guardada correctamente!',
          "center",
          "top",
          ["success-snackbar"]
        );
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "Error al guardar la factura",
          "center",
          "top",
          ["error-snackbar"]
        );
        console.error("error", err);
      },
    });
  }

  update(item: IManualInvoice) {
    this.edit(item.id, item).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        this.alertService.displayAlert(
          "success",
          response.message,
          "center",
          "top",
          ["success-snackbar"]
        );
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "An error occurred adding the team",
          "center",
          "top",
          ["error-snackbar"]
        );
        console.error("error", err);
      },
    });
  }

  delete(item: IManualInvoice) {
    this.del(item.id).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        this.alertService.displayAlert(
          "success",
          response.message,
          "center",
          "top",
          ["success-snackbar"]
        );
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "An error occurred adding the team",
          "center",
          "top",
          ["error-snackbar"]
        );
        console.error("error", err);
      },
    });
  }

  clearCurrentInvoice() {
    this.currentInvoice.set(null);
  }

  getMonthlyDataset(invoices: IManualInvoice[]) {
    const ingresoData = new Array(12).fill(0);
    const gastoData = new Array(12).fill(0);

    invoices.forEach(invoice => {
      if (!invoice.issueDate) {
        return;
      }
      const date = new Date(invoice.issueDate);
      const monthIndex = date.getMonth();

      const totalInvoiceAmount = invoice.details?.reduce((sum, d) => sum + (d.total || 0), 0);

      if (invoice.type === 'ingreso') {
        ingresoData[monthIndex] += totalInvoiceAmount;
      } else if (invoice.type === 'gasto') {
        gastoData[monthIndex] += totalInvoiceAmount;
      }
    });

    return [
      {
        label: "Ingresos",
        data: ingresoData,
        backgroundColor: '#4A403D'
      },
      {
        label: "Gastos",
        data: gastoData,
        backgroundColor: '#EA804C'
      }
    ];
  }

  getMonthlyFlujoCajaDataset(invoices: IManualInvoice[]) {
    const flujoCajaData = new Array(12).fill(0);
    const ingresoData = new Array(12).fill(0);
    const gastoData = new Array(12).fill(0);

    invoices.forEach(invoice => {
      if (!invoice.issueDate) {
        return;
      }
      const date = new Date(invoice.issueDate);
      const monthIndex = date.getMonth();

      const totalInvoiceAmount = invoice.details?.reduce((sum, d) => sum + (d.total || 0), 0);

      if (invoice.type === 'ingreso') {
        ingresoData[monthIndex] += totalInvoiceAmount;
      } else if (invoice.type === 'gasto') {
        gastoData[monthIndex] += totalInvoiceAmount;
      }
    });

    for (let i = 0; i < 12; i++) {
      flujoCajaData[i] = ingresoData[i] - gastoData[i];
    }

    return [
      {
        label: "Flujo de Caja",
        data: flujoCajaData,
        backgroundColor: '#4A403D',
        borderColor: '#4A403D',
        borderWidth: 2,
      },
      {
        label: "Ingresos",
        data: ingresoData,
        backgroundColor: '#3E885B',
        borderColor: '#3E885B',
        borderWidth: 2,
      },
      {
        label: "Gastos",
        data: gastoData,
        backgroundColor: '#8B2F25',
        borderColor: '#8B2F25',
        borderWidth: 2,
      }
    ];
  }

  getTrimestersFlujoCajaDataset(invoices: IManualInvoice[]) {
    const flujoCajaData = new Array(4).fill(0);
    const ingresoData = new Array(4).fill(0);
    const gastoData = new Array(4).fill(0);

    invoices.forEach(invoice => {
      if (!invoice.issueDate || !invoice.details) return;

      const date = new Date(invoice.issueDate);
      const month = date.getMonth(); // 0-11
      const trimesterIndex = Math.floor(month / 3); // 0-3

      const total = invoice.details.reduce((sum, d) => sum + (d.total || 0), 0);

      if (invoice.type === 'ingreso') {
        ingresoData[trimesterIndex] += total;
      } else if (invoice.type === 'gasto') {
        gastoData[trimesterIndex] += total;
      }
    });

    for (let i = 0; i < 4; i++) {
      flujoCajaData[i] = ingresoData[i] - gastoData[i];
    }

    return [
      {
        label: "Flujo de Caja",
        data: flujoCajaData,
        backgroundColor: '#4A403D',
        borderColor: '#4A403D',
        borderWidth: 2,
      },
      {
        label: "Ingresos",
        data: ingresoData,
        backgroundColor: '#3E885B',
        borderColor: '#3E885B',
        borderWidth: 2,
      },
      {
        label: "Gastos",
        data: gastoData,
        backgroundColor: '#8B2F25',
        borderColor: '#8B2F25',
        borderWidth: 2,
      }
    ];
  }

  getGastoCategoriaDataset(invoices: IManualInvoice[]) {
    const categoriaTotales: Record<string, number> = {};

    for (const invoice of invoices) {
      if (invoice.type !== 'gasto' || !invoice.details) continue;

      for (const detail of invoice.details) {
        const categoria = detail.category || 'Sin Categoría';
        const total = detail.total || 0;
        categoriaTotales[categoria] = (categoriaTotales[categoria] || 0) + total;
      }
    }

    const top5 = Object.entries(categoriaTotales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const labels = top5.map(([categoria]) => this.categories[categoria]);
    const data = top5.map(([, total]) => total);
    const colors = ['#B5473A', '#FACF7D', '#EA804C', '#FFF1C1', '#4A403D'];

    return {
      labels: labels,
      datasets: [
        {
          label: this.categories[labels.join(', ')],
          data: data,
          backgroundColor: colors.slice(0, labels.length)
        }
      ]
    };
  }
}
