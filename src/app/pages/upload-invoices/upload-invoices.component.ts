import { Component, inject, ViewChild } from '@angular/core';
import { InputFileFormComponent } from '../../components/input-file-form/input-file-form.component';
import { LlamaLoaderComponent } from '../../components/llama-loader/llama-loader.component';
import { CommonModule } from '@angular/common';
import { OcrService } from '../../services/ocr.service';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from "../../components/modal/modal.component";

@Component({
  selector: 'app-upload-invoices',
  standalone: true,
  imports: [InputFileFormComponent, LlamaLoaderComponent, CommonModule, ModalComponent],
  templateUrl: './upload-invoices.component.html',
  styleUrl: './upload-invoices.component.scss'
})
export class UploadInvoicesComponent {
  public hideImportInvoicesVar: boolean = true;
  public importInvoicesText: string = "Ocultar importar";
  public importInvoicesIcon: string = "receipt_long_off";
  public ocrService: OcrService = inject(OcrService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('cancelSubscriptionModal') public cancelSubscriptionModal: any;


  hideImportInvoices() {
    this.hideImportInvoicesVar = !this.hideImportInvoicesVar;

    if (this.hideImportInvoicesVar) {
      this.importInvoicesText = "Ocultar importar";
      this.importInvoicesIcon = "receipt_long_off";
    } else {
      this.importInvoicesText = "Mostrar importar";
      this.importInvoicesIcon = "receipt_long";
    }
  }

  openModal() {
    this.modalService.displayModal(this.cancelSubscriptionModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }

  cancelCurrentRequest() {
    this.ocrService.cancelCurrentRequest();
    this.hideModal();
  }
}
