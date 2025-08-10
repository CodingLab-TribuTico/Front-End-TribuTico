import { Injectable } from "@angular/core";
import { IIsrSimulation } from "../interfaces";
import { SimulationExportService } from "./simulation-export.service";

@Injectable({
  providedIn: 'root'
})
export class IsrExportService extends SimulationExportService<IIsrSimulation> {
  protected override source = 'isr';
  protected override fileBaseName = 'Simulación_ISR';

}