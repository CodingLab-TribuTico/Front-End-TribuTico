import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IResponse, ISearch, IManualInvoice } from "../interfaces";
import { AlertService } from "./alert.service";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class InvoiceService extends BaseService<IManualInvoice> {
  protected override source: string = "invoices";
  private invoicesList = signal<IManualInvoice[]>([]);
  private currentInvoice = signal<IManualInvoice | null>(null);
  get invoices$() {
    return this.invoicesList;
  }
  get currentInvoice$() {
    return this.currentInvoice;
  }
  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
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
        console.log("response", response);
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

  getById(id: number) {
    this.find(id).subscribe({
      next: (response: IResponse<IManualInvoice>) => {
        console.log("response currentInvoice", response);
        this.currentInvoice.set(response.data);
      },
      error: (err: any) => {
        console.error("error", err);
      },
    });
  }

  save(item: IManualInvoice) {
    this.add(item).subscribe({
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

  saveInvoice(item: IManualInvoice): Observable<IResponse<IManualInvoice>> {
    return this.http.post<IResponse<IManualInvoice>>(`${this.source}`, item).pipe(
      tap((response) => {
        this.alertService.displayAlert('success', response.message || 'Factura guardada correctamente!', 'center', 'top', ['success-snackbar']);
        this.getAll(); 
      }),
      catchError((error) => {
        this.alertService.displayAlert('error', 'Error al guardar la factura', 'center', 'top', ['error-snackbar']);
        console.error('Error al guardar la factura:', error);
        throw error;
      })
    );
  }

  saveWithUserId(item: IManualInvoice, userId: number): Observable<IResponse<IManualInvoice>> {
    return this.saveInvoice(item); 
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

}
