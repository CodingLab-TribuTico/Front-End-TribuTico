import { Component, effect, ElementRef, EventEmitter, inject, Input, Output, Signal, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { XmlService } from '../../services/xml.service';

@Component({
  selector: 'app-input-file-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-file-form.component.html',
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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

      this.selectedFile = file;
      this.callScanMethod.emit(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.clearFileInput();
  }

  clearFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
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
      this.selectedFile = file;
      this.callScanMethod.emit(file);
    }
  }

  openModal() {
    this.callOpenModalMethod.emit();
  }
}