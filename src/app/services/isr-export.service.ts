import { inject, Injectable } from "@angular/core";
import { IIsrSimulation } from "../interfaces";
import { BaseService } from "./base-service";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class IsrExportService extends BaseService<IIsrSimulation> {
  protected override source: string = 'export';
  private alertService: AlertService = inject(AlertService);

  generatePdf(simulation: IIsrSimulation) {
    const url = `${this.source}/generate-pdf/${simulation.id}`; 
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        if (response.type === 'application/pdf') {
          const downloadUrl = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `Simulación_ISR.pdf`;
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
        } else {
          this.alertService.showAlert('error', 'La respuesta no es un archivo CSV válido');
        }
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al descargar el archivo PDF');  
      }
    });
  }

  generateCsv(simulation: IIsrSimulation) {
    const url = `${this.source}/generate-csv/${simulation.id}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        if (response.type === 'text/csv') {
          const downloadUrl = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `Simulación_ISR.csv`;
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
        } else {
          this.alertService.showAlert('error', 'La respuesta no es un archivo CSV válido');
        }
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al descargar el archivo CSV');
      }
    });
  }
}