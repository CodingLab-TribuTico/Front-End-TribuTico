import { Component, effect, ElementRef, EventEmitter, inject, Input, Output, Signal, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { XmlService } from '../../services/xml.service';

@Component({
  selector: 'app-input-file-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-file-form.component.html',
  styleUrl: './input-file-form.component.scss'
})
export class InputFileFormComponent {
  private alertService: AlertService = inject(AlertService);
  private xmlService: XmlService = inject(XmlService);
  @Output() callScanMethod: EventEmitter<File> = new EventEmitter<File>();
  @Output() callOpenModalMethod: EventEmitter<void> = new EventEmitter<void>();
  @Input() cancelOption: boolean = true;
  @Input({ required: true }) isLoading!: Signal<boolean>;
  selectedFile: File | null = null;
  isDragging = false;

  constructor() {
    effect(() => {
      if (!this.isLoading()) {
        this.removeFile();
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      this.selectedFile = file;

      if (fileExtension === 'xml') {
        this.xmlService.scanFile(file);
      } else {
        this.callScanMethod.emit(file);
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFileSelection(file);
    }
  }

  private handleFileSelection(file: File): void {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    this.selectedFile = file;

    if (fileExtension === 'xml') {
      this.xmlService.scanFile(file);
    } else if (fileExtension === 'pdf') {
      this.callScanMethod.emit(file);
    } else {
      this.alertService.displayAlert('error', 'Tipo de archivo no válido. Solo se aceptan PDF o XML.', 'center', 'top', ['error-snackbar']);
    }
  }

  openModal() {
    this.callOpenModalMethod.emit();
  }
}