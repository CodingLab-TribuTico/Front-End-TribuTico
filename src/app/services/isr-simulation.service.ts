import { inject, Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { IIsrSimulation, IResponse } from '../interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class IsrSimulationService extends BaseService<IResponse<IIsrSimulation>> {
  protected override source: string = 'isr-simulation';
  private currentSubscription: Subscription | null = null;
  public isrSimulation: IIsrSimulation | null = null;
  private alertService: AlertService = inject(AlertService);

  createSimulation(year: number, childrenNumber: number, hasSpouse: boolean) {
    this.currentSubscription = this.findAllWithParams({
      year: year,
      childrenNumber: childrenNumber,
      hasSpouse: hasSpouse
    }).subscribe({
      next: (response: any) => {
        this.isrSimulation = response.data;
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al crear la simulación de ISR');
      },
    });
  }

}
