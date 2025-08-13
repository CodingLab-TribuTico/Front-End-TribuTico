import { inject, Injectable } from "@angular/core";
import { BaseService } from "./base-service";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export abstract class SimulationExportService<T> extends BaseService<T> {
  protected abstract override source: string; 
  private alertService: AlertService = inject(AlertService);

  protected abstract fileBaseName: string; 

  protected exportFile(simulationId: number, format: 'pdf' | 'csv') {
    if (!simulationId) {
      this.alertService.showAlert('error', 'El ID de la simulación no es válido');
      return;
    }

    const url = `${this.source}/generate-${format}/${simulationId}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        const expectedType = format === 'pdf' ? 'application/pdf' : 'text/csv';
        
        if (!response.type || response.type === expectedType) {
          const downloadUrl = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${this.fileBaseName}.${format}`;
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
        } else {
          this.alertService.showAlert('error', `La respuesta no es un archivo válido`);
        }
      },
      error: () => {
        this.alertService.showAlert('error', `Ocurrió un error al descargar el archivo`);
      }
    });
  }

  generatePdf(simulation: T) {
    this.exportFile((simulation as any).id, 'pdf');
  }

  generateCsv(simulation: T) {
    this.exportFile((simulation as any).id, 'csv');
  }
  
}