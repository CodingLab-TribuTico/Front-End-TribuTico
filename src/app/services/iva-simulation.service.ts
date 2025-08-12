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

  public simulationsIvaSignal = signal<IIvaCalculation[]>([]);
  public currentIvaSimulationSignal = signal<IIvaCalculation | null>(null);

  public simulationsIva$ = () => this.simulationsIvaSignal();
  public currentIvaSimulation$ = () => this.currentIvaSimulationSignal();

  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  };
  public totalItems: any = [];

  createSimulation(year: number, month: number, userId: number) {
    this.currentSubscription = this.findAllWithParamsAndCustomSource('create', {
      year: year,
      month: month,
      userId: userId,
    }).subscribe({
      next: (response: any) => {
        this.currentIvaSimulationSignal.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al crear la simulación de IVA');
      },
    });
  }

  clearSimulation() {
    this.currentIvaSimulationSignal.set(null);
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
        this.simulationsIvaSignal.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al obtener las simulaciones del IVA');
      }
    });
  }

  getById(id: number) {
    this.find(id).subscribe({
      next: (response: IResponse<IIvaCalculation>) => {
        this.currentIvaSimulationSignal.set(response.data);
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
        this.simulationsIvaSignal.set(response.data);
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
    this.currentIvaSimulationSignal.set(null);
  }
}
