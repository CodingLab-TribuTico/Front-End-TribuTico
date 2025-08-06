import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IIsrSimulation } from "../../interfaces";

@Component({
  selector: "app-simulation-list",
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: "./simulation-list.component.html",
})
export class SimulationListComponent {
  @Output() callDeleteAction: EventEmitter<IIsrSimulation> =new EventEmitter<IIsrSimulation>();
  @Output() generatePdf = new EventEmitter<any>();
  @Output() generateCsv = new EventEmitter<any>();
  @Input() simulations: any[] = [];

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

  simulationType(item: any) {
    if (item.type) {
      return item.type.toLowerCase();
    }
  }

  simulationIdentification(item: any) {
    return item.simulationIdentification || item.user?.identification || 'N/A';
  }

  exportPdf(item: any) {
    this.generatePdf.emit(item);
  }

  exportCsv(item: any) {
    this.generateCsv.emit(item);
  }

}