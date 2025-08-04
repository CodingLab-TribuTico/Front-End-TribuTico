import { Injectable, inject } from '@angular/core';
import { BaseService } from './base-service';
import { IIvaCalculation, IResponse } from '../interfaces';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IvaSimulationService extends BaseService<IResponse<IIvaCalculation>> {
  protected override source: string = 'iva-simulation';
  private currentSubscription: Subscription | null = null;
  public ivaSimulation: IIvaCalculation | null = null;

  createSimulation(year: number, month: number, userId: number, callback?: (simulation: IIvaCalculation | null) => void) {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }
    
    const params = { 
      year: year, 
      month: month, 
      userId: userId, 
      _t: Date.now()
    };
    
    this.currentSubscription = this.findAllWithParams(params).subscribe({
      next: (response: any) => {
        this.ivaSimulation = response.data;
        
       
        if (callback) {
          callback(this.ivaSimulation);
        }
      },
      error: (err: any) => {
        console.error('Error al crear simulación IVA:', err);
        this.ivaSimulation = null;
        
        if (callback) {
          callback(null);
        }
      },
    });
  }

  refreshSimulation(callback?: (simulation: IIvaCalculation | null) => void) {
    if (!this.ivaSimulation) {
      if (callback) callback(null);
      return;
    }
    
    this.forceRecalculation(
      this.ivaSimulation.year, 
      this.ivaSimulation.month, 
      this.ivaSimulation.user?.id || 0,
      callback
    );
  }

  forceRecalculation(year: number, month: number, userId: number, callback?: (simulation: IIvaCalculation | null) => void) {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    const requestBody = { year, month, userId };
    
    this.currentSubscription = this.add(requestBody).subscribe({
      next: (response: any) => {
        this.ivaSimulation = response.data;
        
        if (callback) {
          callback(this.ivaSimulation);
        }
      },
      error: (err: any) => {
        console.error('Error al recalcular simulación IVA:', err);
        
        this.createSimulation(year, month, userId, callback);
      }
    });
  }

  forceCompleteRefresh(year: number, month: number, userId: number, callback?: (simulation: IIvaCalculation | null) => void) {
    if (this.ivaSimulation?.id) {
      this.http.delete(`${this.source}/${this.ivaSimulation.id}`).subscribe({
        next: () => {
          this.forceRecalculation(year, month, userId, callback);
        },
        error: (err) => {
          this.forceRecalculation(year, month, userId, callback);
        }
      });
    } else {
      this.forceRecalculation(year, month, userId, callback);
    }
  }

  clearSimulation() {
    this.ivaSimulation = null;
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
  }
}
