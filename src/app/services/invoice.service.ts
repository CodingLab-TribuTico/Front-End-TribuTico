import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IResponse, ISearch, IManualInvoice } from "../interfaces";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: "root",
})
export class InvoiceService extends BaseService<IManualInvoice> {
  protected override source: string = "electronic-bill";
  private invoicesList = signal<IManualInvoice[]>([]);
  get invoices$() {
    return this.invoicesList;
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
}
