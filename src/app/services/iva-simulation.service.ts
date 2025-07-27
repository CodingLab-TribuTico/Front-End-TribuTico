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
  
  // Cambiamos a BehaviorSubject para notificar cambios
  private ivaSimulationSubject = new BehaviorSubject<IIvaCalculation | null>(null);
  public ivaSimulation$ = this.ivaSimulationSubject.asObservable();
  
  // Mantenemos la propiedad pública para compatibilidad
  public get ivaSimulation(): IIvaCalculation | null {
    return this.ivaSimulationSubject.value;
  }

  createSimulation(year: number, month: number, userId: number) {
    console.log('Obteniendo simulación IVA existente con parámetros:', { year, month, userId });
    
    // Por ahora usamos GET para obtener simulaciones existentes con datos
    // En lugar de POST que crea una nueva simulación vacía
    this.getExistingSimulations(year, month, userId);
  }

  // Método adicional para obtener simulaciones existentes si es necesario
  getExistingSimulations(year: number, month: number, userId: number) {
    console.log('Obteniendo simulaciones IVA existentes con parámetros:', { year, month, userId });
    
    this.currentSubscription = this.findAllWithParams({
      year: year,
      month: month,
      userId: userId
    }).subscribe({
      next: (response: any) => {
        console.log('Simulaciones IVA existentes:', response);
        console.log('Datos de las simulaciones (raw):', response.data);
        
        // El backend devuelve un array, tomamos el primer elemento o el más reciente
        let simulationData: IIvaCalculation | null = null;
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // En lugar de tomar solo la última, buscamos la simulación con más datos/actividad
          simulationData = this.selectBestSimulation(response.data);
          console.log('Simulación seleccionada (con más actividad):', simulationData);
        } else if (response.data && !Array.isArray(response.data)) {
          // Si no es array, lo usamos directamente
          simulationData = response.data;
          console.log('Simulación única:', simulationData);
        } else {
          console.warn('No se encontraron simulaciones en la respuesta');
        }
        
        // Notificamos el cambio usando el BehaviorSubject
        this.ivaSimulationSubject.next(simulationData);
      },
      error: (err: any) => {
        console.error('Error al obtener simulaciones de IVA:', err);
        // También notificamos errores
        this.ivaSimulationSubject.next(null);
      },
    });
  }

  // Método privado para seleccionar la mejor simulación basada en actividad
  private selectBestSimulation(simulations: IIvaCalculation[]): IIvaCalculation {
    console.log('Seleccionando la mejor simulación entre', simulations.length, 'opciones');
    
    // Calculamos un "score" para cada simulación basado en cuánta actividad tiene
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
    
    // Ordenamos por score (mayor actividad primero), luego por ID (más reciente)
    simulationsWithScore.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score; // Mayor score primero
      }
      return (b.simulation.id || 0) - (a.simulation.id || 0); // ID más alto primero si empatan
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
