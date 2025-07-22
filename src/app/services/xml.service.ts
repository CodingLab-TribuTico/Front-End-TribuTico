import { Injectable, signal } from '@angular/core';
import { IResponse } from '../interfaces';
import { BaseService } from './base-service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XmlService extends BaseService<IResponse<any>> {

  protected override source: string = 'xml';
  public isLoadingSignal = signal(false);
  public responseScan = signal<IResponse<any> | null>(null);
  private currentSubscription: Subscription | null = null;

  get responseScan$() {
    return this.responseScan;
  }
  get isLoading$() {
    return this.isLoadingSignal;
  }

  scanFile(file: File) {
    if (file) {

      this.isLoadingSignal.set(true);
      const formData = new FormData();
      formData.append('file', file);

      this.currentSubscription = this.addFile(formData).subscribe({
        next: (response: any) => {
          console.log('Respuesta escaneo XML:', response);
          this.responseScan.set(response);
        },
        error: (err: any) => {
          console.error('error', err);
          this.isLoadingSignal.set(false);
        },
        complete: () => {
          this.isLoadingSignal.set(false);
          this.currentSubscription = null;
        }
      });
    } else {
      console.error('No file selected.');
    }
  }

  cancelCurrentRequest() {
    this.responseScan.set(null);
    this.isLoadingSignal.set(false);
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
  }

}
