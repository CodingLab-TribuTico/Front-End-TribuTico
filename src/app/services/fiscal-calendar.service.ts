import { inject, Injectable, isSignal, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IFiscal, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: "root",
})
export class FiscalCalendarService extends BaseService<IResponse<any>> {
  protected override source: string = "fiscal-calendar";
  private alertService: AlertService = inject(AlertService);
  private fiscalCalendarList = signal<IFiscal[]>([]);

  get fiscalCalendar$() {
    return this.fiscalCalendarList.asReadonly();
  }

  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  };

  public totalItems: any = [];

  getAll() {
    this.findAllWithParams({
      page: this.search.page,
      size: this.search.size,
      search: this.search.search,
    }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.fiscalCalendarList.set(response.data);
      },
      error: (err: any) => {
        this.alertService.displayAlert("error", err);
      },
    });
  }

  saveFiscalCalendar(notification: IFiscal) {
    this.add(notification).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert("success", response.message);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error", err.message
        );
      },
    });
  }

  updateFiscalCalendar(calendar: IFiscal) {
    console.log(calendar);
    this.edit(calendar.id, calendar).subscribe({
      next: (response: IResponse<any>) => {
        this.alertService.showAlert(
          "success",
          response.message);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert("error", err.message);
      },
    });
  }

  delete(calendar: IFiscal) {
    this.delCustomSource(`${calendar.id}`).subscribe({
      next: (response: any) => {
        this.alertService.showAlert("success", response.message);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error", err.message
        );
      },
    });
  }
}
