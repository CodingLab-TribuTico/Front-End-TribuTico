import { Injectable, inject } from '@angular/core';
import { BaseService } from './base-service';
import { IIvaCalculation, IResponse } from '../interfaces';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class IvaSimulationService extends BaseService<IResponse<IIvaCalculation>> {
  protected override source: string = 'iva-simulation';
  private currentSubscription: Subscription | null = null;
  public ivaSimulation: IIvaCalculation | null = null;
  private alertService: AlertService = inject(AlertService);


  createSimulation(year: number, month: number, userId: number) {
    this.currentSubscription = this.findAllWithParams({
      year: year,
      month: month,
      userId: userId,
    }).subscribe({
      next: (response: any) => {
        this.ivaSimulation = response.data;
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al crear la simulación de IVA');
      },
    });
  }

  clearSimulation() {
    this.ivaSimulation = null;
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
  }
}
