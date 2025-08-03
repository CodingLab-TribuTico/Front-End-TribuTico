import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileProcessingService {

  buildFormData(file: File, type: string = 'ingreso'): FormData {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return formData;
  }
}
