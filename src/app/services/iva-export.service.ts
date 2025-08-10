import { inject, Injectable } from "@angular/core";

import { BaseService } from "./base-service";
import { AlertService } from "./alert.service";
import { IIvaCalculation } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class IvaExportService extends BaseService<IIvaCalculation> {
  protected override source: string = 'iva-export';
  private alertService: AlertService = inject(AlertService);

  generatePdf(simulation: IIvaCalculation) {
    const url = `${this.source}/generate-pdf/${simulation.id}`; 
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        if (response.type === 'application/pdf') {
          const downloadUrl = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `Simulación_IVA.pdf`;
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

  generateCsv(simulation: IIvaCalculation) {
    const url = `${this.source}/generate-csv/${simulation.id}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        if (response.type === 'text/csv') {
          const downloadUrl = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `Simulación_IVA.csv`;
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