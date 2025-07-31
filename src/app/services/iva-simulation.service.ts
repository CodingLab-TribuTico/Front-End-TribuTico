import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { IIvaCalculation, IResponse } from '../interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IvaSimulationService extends BaseService<IResponse<IIvaCalculation>> {
  protected override source: string = 'iva-simulation';
  private currentSubscription: Subscription | null = null;
  
  private ivaSimulationSubject = new BehaviorSubject<IIvaCalculation | null>(null);
  public ivaSimulation$ = this.ivaSimulationSubject.asObservable();
  
  public get ivaSimulation(): IIvaCalculation | null {
    return this.ivaSimulationSubject.value;
  }

  createSimulation(year: number, month: number, userId: number) {
    
    
    this.getExistingSimulations(year, month, userId);
  }

  getExistingSimulations(year: number, month: number, userId: number) {
    
    this.currentSubscription = this.findAllWithParams({
      year: year,
      month: month,
      userId: userId
    }).subscribe({
      next: (response: any) => {
        console.log('Simulaciones IVA existentes:', response);
        console.log('Datos de las simulaciones (raw):', response.data);
        
        let simulationData: IIvaCalculation | null = null;
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          simulationData = this.selectBestSimulation(response.data);
          console.log('Simulación seleccionada (con más actividad):', simulationData);
        } else if (response.data && !Array.isArray(response.data)) {
          simulationData = response.data;
          console.log('Simulación única:', simulationData);
        } else {
          console.warn('No se encontraron simulaciones en la respuesta');
        }
        
        this.ivaSimulationSubject.next(simulationData);
      },
      error: (err: any) => {
        console.error('Error al obtener simulaciones de IVA:', err);
        this.ivaSimulationSubject.next(null);
      },
    });
  }

  private selectBestSimulation(simulations: IIvaCalculation[]): IIvaCalculation {
    console.log('Seleccionando la mejor simulación entre', simulations.length, 'opciones');
    
    const simulationsWithScore = simulations.map(sim => {
      const activityScore = 
        (sim.ivaVentasBienes || 0) +
        (sim.ivaVentasServicios || 0) +
        (sim.ivaExportaciones || 0) +
        (sim.ivaActividadesAgropecuarias || 0) +
        (sim.ivaComprasBienes || 0) +
        (sim.ivaComprasServicios || 0) +
        (sim.ivaImportaciones || 0) +
        (sim.ivaGastosGenerales || 0) +
        (sim.ivaActivosFijos || 0);
      
      console.log(`Simulación ID ${sim.id}: Score de actividad = ${activityScore}`);
      
      return {
        simulation: sim,
        score: activityScore,
        hasData: activityScore > 0
      };
    });
    
    simulationsWithScore.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score; 
      }
      return (b.simulation.id || 0) - (a.simulation.id || 0); 
    });
    
    const selected = simulationsWithScore[0].simulation;
    console.log(`Simulación seleccionada: ID ${selected.id} con score ${simulationsWithScore[0].score}`);
    
    return selected;
  }

  
  cancelCurrentSubscription() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
  }

  
  clearSimulation() {
    this.ivaSimulationSubject.next(null);
  }
}
