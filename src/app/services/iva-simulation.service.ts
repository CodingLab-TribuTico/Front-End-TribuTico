import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IIvaCalculation, IResponse, ISearch } from '../interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class IvaSimulationService extends BaseService<IIvaCalculation> {
  protected override source: string = 'iva-simulation';
  private currentSubscription: Subscription | null = null;
  public ivaSimulation: IIvaCalculation | null = null;
  private alertService: AlertService = inject(AlertService);
  private simulationsByUserIdList = signal<IIvaCalculation[]>([]);
  private simulationListSignal = signal<IIvaCalculation[]>([]);
  private currentSimulation = signal<IIvaCalculation | null>(null);
  public totalItems: any = [];
 
  get simulationsIva$() {
    return this.simulationListSignal;
  }

  get currentIvaSimulation$() {
    return this.currentSimulation;
  }

  get simulationsByUserIdList$() {
    return this.simulationsByUserIdList;
  }
 
  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  }

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
    
    this.currentSubscription = this.findAllWithParamsAndCustomSource('create', params).subscribe({
      next: (response: any) => {
        this.ivaSimulation = response.data;
        
        if (callback) {
          callback(this.ivaSimulation);
        }
      },
      error: () => {
        this.alertService.showAlert('error', 'Error al crear simulación IVA');
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
      error: () => {
        this.alertService.showAlert('error', 'Error al recalcular simulación IVA');
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
        error: () => {
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

  saveSimulationIva(simulation: IIvaCalculation) {
    return this.add(simulation).subscribe({
      next: (response: any) => {
        this.alertService.showAlert('success', response.message);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al guardar la simulación de IVA');
      }
    });
  }

  getAll() {
    this.findAllWithParams({
      page: this.search.page,
      size: this.search.size,
      search: this.search.search
    }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1);
        this.simulationListSignal.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener las simulaciones del IVA');
      }
    });
  }

  getById(id: number) {
    this.find(id).subscribe({
      next: (response: IResponse<IIvaCalculation>) => {
        this.currentSimulation.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al recuperar la simulación');
      },
    });
  }
   
  getByUserId(userId: number) {
    this.findAllWithParams({ userId }).subscribe({
      next: (response: IResponse<IIvaCalculation[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 }, 
          (_, i) => i + 1);
        this.simulationListSignal.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al recuperar las simulaciones del usuario');
      }
    });
  }
     
  delete(simulation: IIvaCalculation) {
    this.delCustomSource(`${simulation.id}`).subscribe({
      next: (response: any) => {
        this.alertService.showAlert('success', response.message);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error eliminando al usuario');
      }
    });
  }
  
  clearCurrentSimulation() {
    this.currentSimulation.set(null);
  }

}
