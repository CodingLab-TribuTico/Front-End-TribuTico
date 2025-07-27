import { inject, Injectable, signal } from '@angular/core';
import { IManualInvoice, IResponse } from '../interfaces';
import { BaseService } from './base-service';
import { InvoiceService } from './invoice.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService<IResponse<any>> {
  public invoiceService: InvoiceService = inject(InvoiceService);
  private invoicesMonthlyGastosIngresos = signal<any[]>([]);
  private invoicesMonthlyFlujoCaja = signal<any[]>([]);

  get invoicesMonthlyGastosIngresos$() {
    return this.invoicesMonthlyGastosIngresos;
  }

  get invoicesMonthlyFlujoCaja$() {
    return this.invoicesMonthlyFlujoCaja;
  }
}
