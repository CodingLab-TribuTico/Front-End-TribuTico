import { Component, computed, inject, signal } from "@angular/core";
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
  public isrService = inject(IsrSimulationService);
  public ivaService = inject(IvaSimulationService);
  public isrExportService = inject(IsrExportService);
  public ivaExportService = inject(IvaExportService);
  public alertService = inject(AlertService);
  public searchType = signal<string>('');

  public currentPage = signal(1);
  public pageSize = 5;

  public allSimulations = computed(() => {
    const iva = this.ivaService.simulationsIva$().map(i => ({ ...i, type: 'IVA' }));
    const isr = this.isrService.simulationsIsr$().map(s => ({ ...s, type: 'ISR' }));

    const all = [...iva, ...isr].sort((a, b) => {
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return dateA - dateB;
    });

    const search = this.searchType().trim().toLowerCase();
    if (!search) return all;

    return all.filter(sim => sim.type.toLowerCase().includes(search));
  });


  public paginatedSimulations = computed(() => {
    const all = this.allSimulations();
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  public totalPages = computed(() => {
    return Math.ceil(this.allSimulations().length / this.pageSize) || 1;
  });

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value || '';
    this.searchType.set(value.trim().toLowerCase());
    this.currentPage.set(1);
  }

  constructor() {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = user.id;
    this.loadSimulations(userId);
  }

  loadSimulations(userId: number) {
    this.ivaService.getByUserId(userId);
    this.isrService.getByUserId(userId);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  downloadPdf(simulation: any) {
    if (this.isIsrSimulation(simulation)) {
      this.isrExportService.generatePdf(simulation);
    } else if (this.isIvaSimulation(simulation)) {
      this.ivaExportService.generatePdf(simulation);
    } else {
      this.alertService.showAlert('error', 'Error al descargar el archivo');
    }
  }

  downloadCsv(simulation: any) {
    if (this.isIsrSimulation(simulation)) {
      this.isrExportService.generateCsv(simulation);
    } else if (this.isIvaSimulation(simulation)) {
      this.ivaExportService.generateCsv(simulation);
    } else {
      this.alertService.showAlert('error', 'Error al descargar el archivo');
    }
  }

  isIsrSimulation(simulation: any): boolean {
    return simulation && typeof simulation.simulationPeriod === 'string';
  }

  isIvaSimulation(simulation: any): boolean {
    return simulation && typeof simulation.year === 'number' && typeof simulation.month === 'number';
  }
}
