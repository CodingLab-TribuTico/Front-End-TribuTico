import { inject, Injectable, signal } from '@angular/core';
import { IResponse } from '../interfaces';
import { BaseService } from './base-service';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';
import { FileProcessingService } from './file-processing.service';

@Injectable({
  providedIn: 'root'
})
export class OcrService extends BaseService<IResponse<any>> {
  protected override source: string = 'ocr';
  private alertService: AlertService = inject(AlertService);
  private fileProcessor: FileProcessingService = inject(FileProcessingService);
  public isLoadingSignal = signal(false);
  public responseScan = signal<IResponse<any> | null>(null);
  private currentSubscription: Subscription | null = null;

  get responseScan$() {
    return this.responseScan;
  }
  get isLoading$() {
    return this.isLoadingSignal;
  }

  scanFile(file: File, type: string = 'ingreso') {
    this.cancelCurrentRequest();
    const formData = this.fileProcessor.buildFormData(file, type);
    this.isLoadingSignal.set(true);
    this.currentSubscription = this.addFile(formData).subscribe({
      next: (response: any) => {
        this.responseScan.set(response);
        this.alertService.showAlert('success', "Archivo escaneado correctamente");
      },
      error: () => {
        this.isLoadingSignal.set(false);
        this.alertService.showAlert('error', "Ocurrio un error al procesar el archivo");
      },
      complete: () => {
        this.isLoadingSignal.set(false);
        this.currentSubscription = null;
      }
    });
  }

  cancelCurrentRequest() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.isLoadingSignal.set(false);
      this.currentSubscription = null;
    }
  }

  resetResponseScan() {
    this.responseScan.set(null);
  }
}