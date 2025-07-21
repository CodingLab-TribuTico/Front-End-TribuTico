import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { IIsrSimulation, IResponse } from '../interfaces';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsrSimulationService extends BaseService<IResponse<IIsrSimulation>> {
  protected override source: string = 'isr-simulation';
  private currentSubscription: Subscription | null = null;
  public isrSimulation: IIsrSimulation | null = null;

  createSimulation(year: number, childrenNumber: number, hasSpouse: boolean, userId: number) {
    this.currentSubscription = this.findAllWithParams({
      year: year,
      childrenNumber: childrenNumber,
      hasSpouse: hasSpouse,
      userId: userId
    }).subscribe({
      next: (response: any) => {
        this.isrSimulation = response.data;
      },
      error: (err: any) => {
        console.error('error', err);
      },
    });
  }

}
