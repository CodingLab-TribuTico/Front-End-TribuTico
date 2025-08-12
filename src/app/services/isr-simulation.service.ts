import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IIsrSimulation, IResponse, ISearch } from '../interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class IsrSimulationService extends BaseService<IIsrSimulation> {
  protected override source: string = 'isr-simulation';
  private currentSubscription: Subscription | null = null;
  public isrSimulation: IIsrSimulation | null = null;
  private alertService: AlertService = inject(AlertService);
  private simulationsByUserIdList = signal<IIsrSimulation[]>([]);
  private simulationListSignal = signal<IIsrSimulation[]>([]);
  private currentSimulation = signal<IIsrSimulation | null>(null);
  public totalItems: any = [];

  get simulationsIsr$() {
    return this.simulationListSignal;
  }
 
  get currentIsrSimulation$() {
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

  createSimulation(year: number, childrenNumber: number, hasSpouse: boolean) {
    this.currentSubscription = this.findAllWithParamsAndCustomSource('create',{
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

  saveSimulationIsr(simulation: IIsrSimulation) {
    this.add(simulation).subscribe({
      next: (response: any) => {
        this.alertService.showAlert('success', response.message);
        },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al guardar la simulación del ISR');
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
        this.alertService.showAlert('error', 'Ocurrió un error al obtener las simulaciones del ISR');
      }
    });
  }
 
  getById(id: number) {
    this.find(id).subscribe({
      next: (response: IResponse<IIsrSimulation>) => {
        this.currentSimulation.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al recuperar la simulación');
      },
    });
  }
 
  getByUserId(userId: number) {
    this.findAllWithParams({ userId }).subscribe({
      next: (response: IResponse<IIsrSimulation[]>) => {
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
   
  delete(simulation: IIsrSimulation) {
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
