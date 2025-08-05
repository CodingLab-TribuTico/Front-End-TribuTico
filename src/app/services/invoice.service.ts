import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IResponse, ISearch, IManualInvoice } from "../interfaces";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: "root",
})
export class InvoiceService extends BaseService<IManualInvoice> {
  protected override source: string = 'invoices';
  private alertService: AlertService = inject(AlertService);
  private invoicesList = signal<IManualInvoice[]>([]);
  private currentInvoice = signal<IManualInvoice | null>(null);
  private invoicesByUserIdList = signal<IManualInvoice[]>([]);

  get invoices$() {
    return this.invoicesList;
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
  };

  public totalItems: number[] = [];


  getAll() {
    this.findAllWithParams({
      page: this.search.page,
      size: this.search.size,
      search: this.search.search,
    }).subscribe({
      next: (response: IResponse<IManualInvoice[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ?? 0 },
          (_, i) => i + 1
        );
        this.invoicesList.set(response.data);
        console.log("Invoices loaded successfully", response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al recuperar las facturas');
      },
    });
  }

  getById(id: number) {
    this.find(id).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        this.currentInvoice.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al recuperar la factura');
      },
    });
  }

  save(item: IManualInvoice) {
    this.add(item).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        this.alertService.showAlert("success", response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.showAlert("error", "Ocurrió un error al guardar la factura");
      },
    });
  }

  update(item: IManualInvoice) {
    this.edit(item.id, item).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        this.alertService.showAlert("success", response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.showAlert("error", "Ocurrió un error al actualizar la factura");
      },
    });
  }

  delete(item: IManualInvoice) {
    this.del(item.id).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        this.alertService.showAlert("success", response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.showAlert("error", "Ocurrió un error al eliminar la factura");
      },
    });
  }

  clearCurrentInvoice() {
    this.currentInvoice.set(null);
  }
}