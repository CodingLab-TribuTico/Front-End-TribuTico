import { Component, computed, effect, inject, ViewChild } from '@angular/core';
import { LlamaLoaderComponent } from '../../components/llama-loader/llama-loader.component';
import { CommonModule } from '@angular/common';
import { OcrService } from '../../services/ocr.service';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from "../../components/modal/modal.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDetailInvoice, IManualInvoice } from '../../interfaces';
import { InvoiceService } from '../../services/invoice.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { ManualInvoicesFormComponent } from "../../components/manual-invoices/manual-invoices-form/manual-invoices-form.component";
import { InputFileFormComponent } from "../../components/input-file-form/input-file-form.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { XmlService } from '../../services/xml.service';

@Component({
  selector: 'app-upload-invoices',
  standalone: true,
  imports: [LlamaLoaderComponent, CommonModule, ModalComponent, ReactiveFormsModule, ManualInvoicesFormComponent, InputFileFormComponent],
  templateUrl: './upload-invoices.component.html',
})
export class UploadInvoicesComponent {
  public invoicesService: InvoiceService = inject(InvoiceService);
  public authService: AuthService = inject(AuthService);
  public alertService: AlertService = inject(AlertService);
  public hideImportInvoicesVar: boolean = true;
  public importInvoicesText: string = "Ocultar importar";
  public importInvoicesIcon: string = "receipt_long_off";
  public ocrService: OcrService = inject(OcrService);
  public xmlService: XmlService = inject(XmlService);
  public modalService: ModalService = inject(ModalService);
  public fb: FormBuilder = inject(FormBuilder);
  public type: string = 'ingreso';
  public details: IDetailInvoice[] = [];
  @ViewChild('cancelSubscriptionModal') public cancelSubscriptionModal: any;

  public combinedResponse = computed(() => {
    return this.xmlService.responseScan$() || this.ocrService.responseScan$();
  });

  public invoiceForm = this.fb.group({
    id: [''],
    type: ['', Validators.required],
    issueDate: ['', Validators.required],
    consecutive: ['', Validators.required],
    key: ['', Validators.required],
    identification: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
  });

  public detailForm = this.fb.group({
    cabys: ['', Validators.required],
    unit: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]],
    unitPrice: ['', [Validators.required, Validators.min(0)]],
    discount: ['', Validators.required],
    tax: ['', [Validators.required, Validators.min(0)]],
    total: [{ value: '', disabled: true }, Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required]
  });


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

  saveInvoice(item: IManualInvoice) {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      this.alertService.displayAlert('error', 'No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.', 'center', 'top', ['error-snackbar']);
      return;
    }

    this.invoicesService.save(item);
  }

  changeType(type: string) {
    if (type === 'ingreso') {
      this.type = 'gasto';
    } else if (type === 'gasto') {
      this.type = 'ingreso';
    }
  }

  resetScanResponse() {
    this.xmlService.responseScan.set(null);
    this.ocrService.resetResponseScan();
  }
}