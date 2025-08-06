import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IIvaCalculation } from "../../interfaces";

@Component({
  selector: "app-simulation-list",
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: "./simulation-list.component.html",
})
export class SimulationListComponent {
  @Output() pdfRequested = new EventEmitter<any>();
  @Output() csvRequested = new EventEmitter<any>();
  @Input() simulations: any[] = [];

  getSimulationType(item: any) {
    if ('simulationPeriod' in item) return 'isr';
    if ('month' in item && 'year' in item) return 'iva';
    return;
  }

  simulationPeriod(item: any) {
    if (item.simulationPeriod) {
      return item.simulationPeriod;
    }

    if (item.month && item.year) {
      const month = item.month.toString();
      return `${month}/${item.year}`;
    }
  }

  simulationName(item: any) {
    if (item.simulationName) {
      return item.simulationName;
    }

    if (item.user?.name && item.user?.lastname) {
      return `${item.user.name} ${item.user.lastname}`;
    }
  }

  simulationIdentification(item: any) {
    return item.simulationIdentification || item.user?.identification || 'N/A';
  }

  onDownloadPdf(item: any) {
    this.pdfRequested.emit(item);
  }

  onDownloadCsv(item: any) {
    this.csvRequested.emit(item);
  }
  
}