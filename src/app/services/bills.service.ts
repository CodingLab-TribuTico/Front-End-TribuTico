import { inject, Injectable, signal  } from "@angular/core";
import { BaseService } from "./base-service";
import { IResponse, ISearch, IManualBill, IDetailsBill, IUser } from "../interfaces";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: 'root'
})

export class BillsService extends BaseService<IManualBill> {
    protected override source: string = 'electronic-bill';
    private billsList = signal<IManualBill[]>([]);
    get bills$() {
        return this.billsList;
    }
    public search: ISearch = {
        page: 1, 
        size: 5
    }

    public totalItems: any =[];
    private alertService: AlertService = inject(AlertService);

    getAll () {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: IResponse<IManualBill[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.billsList.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  save(item: IManualBill) {
    this.add(item).subscribe({
      next: (response: IResponse<IManualBill>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(item: IManualBill) {
    this.edit(item.id, item).subscribe({
      next: (response: IResponse<IManualBill>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(item: IManualBill) {
    this.del(item.id).subscribe({
      next: (response: IResponse<IManualBill>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

}