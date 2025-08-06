import { Component, computed, inject } from "@angular/core";
import { SimulationListComponent } from "../../components/simulation-list/simulation-list.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { IsrSimulationService } from "../../services/isr-simulation.service";
import { IvaSimulationService } from "../../services/iva-simulation.service";
import { IsrExportService } from "../../services/isr-export.service";
import { IvaExportService } from "../../services/iva-export.service";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: "app-simulation-view",
  standalone: true,
  imports: [
    SimulationListComponent,
    PaginationComponent,
    LoaderComponent
  ],
  templateUrl: "./simulation-view.component.html",
})
export class SimulationViewComponent {

  public title: string = 'Simulaciones';
  private isrService = inject(IsrSimulationService);
  private ivaService = inject(IvaSimulationService);
  private isrExportService = inject(IsrExportService);
  private ivaExportService = inject(IvaExportService);
  private alertService = inject(AlertService);

  public allSimulations = computed(() => {
    const iva = this.ivaService.simulationsIva$();
    const isr = this.isrService.simulationsIsr$();
    return [...iva, ...isr];
  });

  constructor() {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    this.loadSimulations(userId);
  }

  loadSimulations(userId: number) {
    this.ivaService.getByUserId(userId);
    this.isrService.getByUserId(userId);
  }

  downloadPdf(simulation: any) {
    if (this.isIsrSimulation(simulation)) {
      this.isrExportService.generatePdf(simulation);
    } else if (this.isIvaSimulation(simulation)) {
      this.ivaExportService.generatePdf(simulation);
    } else {
      this.alertService.showAlert('error', 'Tipo de simulación desconocido');
    }
  }

  downloadCsv(simulation: any) {
    if (this.isIsrSimulation(simulation)) {
      this.isrExportService.generateCsv(simulation);
    } else if (this.isIvaSimulation(simulation)) {
      this.ivaExportService.generateCsv(simulation);
    } else {
      this.alertService.showAlert('error', 'Tipo de simulación desconocido');
    }
  }

  isIsrSimulation(simulation: any): boolean {
    return simulation && typeof simulation.simulationPeriod === 'string';
  }

  isIvaSimulation(simulation: any): boolean {
    return simulation && typeof simulation.year === 'number' && typeof simulation.month === 'number';
  }

  //arreglar search
  search(event: Event) {
    let input = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
  }
}







/*funciona
import { Component, computed, inject } from "@angular/core";
import { SimulationListComponent } from "../../components/simulation-list/simulation-list.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { IsrSimulationService } from "../../services/isr-simulation.service";
import { IvaSimulationService } from "../../services/iva-simulation.service";
import { IIsrSimulation } from "../../interfaces";
import { IsrExportService } from "../../services/isr-export.service";
import { IvaExportService } from "../../services/iva-export.service";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: "app-simulation-view",
  standalone: true,
  imports: [
    SimulationListComponent,
    PaginationComponent,
    LoaderComponent
  ],
  templateUrl: "./simulation-view.component.html",
})
export class SimulationViewComponent {

  public title: string = 'Simulaciones';
  private isrService = inject(IsrSimulationService);
  private ivaService = inject(IvaSimulationService);
  private isrExportService = inject(IsrExportService);
  private ivaExportService = inject(IvaExportService);
  private alertService = inject(AlertService);


  public allSimulations = computed(() => {
    const iva = this.ivaService.simulationsIva$();
    const isr = this.isrService.simulationsIsr$();
    return [...iva, ...isr];
  });

  constructor() {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    this.loadSimulations(userId);
  }

  loadSimulations(userId: number) {
    this.ivaService.getByUserId(userId);
    this.isrService.getByUserId(userId);
  }

  downloadPdf(simulation: any) {
  if (this.isIsrSimulation(simulation)) {
    this.isrExportService.generatePdf(simulation);
  } else if (this.isIvaSimulation(simulation)) {
    this.ivaExportService.generatePdf(simulation);
  } else {
    this.alertService.showAlert('error', 'Tipo de simulación desconocido');
  }
}

downloadCsv(simulation: any) {
  if (this.isIsrSimulation(simulation)) {
    this.isrExportService.generateCsv(simulation);
  } else if (this.isIvaSimulation(simulation)) {
    this.ivaExportService.generateCsv(simulation);
  } else {
    this.alertService.showAlert('error', 'Tipo de simulación desconocido');
  }
}

// Ejemplo simple de chequeo de tipo
isIsrSimulation(simulation: any): boolean {
  return simulation.hasOwnProperty('someIsrSpecificProperty') || simulation.source === 'isr';
}

isIvaSimulation(simulation: any): boolean {
  return simulation.hasOwnProperty('someIvaSpecificProperty') || simulation.source === 'iva';
}



  //arreglar search
  search(event: Event) {
    let input = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
  }
}


*/