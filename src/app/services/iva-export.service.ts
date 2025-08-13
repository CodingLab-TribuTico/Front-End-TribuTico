import { Injectable } from "@angular/core";
import { IIvaCalculation } from "../interfaces";
import { SimulationExportService } from "./simulation-export.service";

@Injectable({
  providedIn: 'root'
})
export class IvaExportService extends SimulationExportService<IIvaCalculation> {
  protected override source = 'iva';
  protected override fileBaseName = 'Simulación_IVA';

}
