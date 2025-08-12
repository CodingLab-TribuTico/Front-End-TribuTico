import { Component, computed, effect, inject, input, ViewChild } from '@angular/core';
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
  @ViewChild('inputFileForm') inputFileForm!: InputFileFormComponent;

  public combinedResponse = computed(() => {
    return this.xmlService.responseScan$() || this.ocrService.responseScan$();
  });

  public isLoading = computed(() => {
    return this.ocrService.isLoading$() || this.xmlService.isLoading$();
  });

  public invoiceForm = this.fb.group({
    id: [''],
    type: ['', Validators.required],
    issueDate: ['', Validators.required],
    consecutive: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    key: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    identification: ['', [Validators.required, Validators.pattern(/^(\d{9}|\d{12})$/)]],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  public detailForm = this.fb.group({
    cabys: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
    unit: ['', Validators.required],
    quantity: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
    unitPrice: [null, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    discount: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    tax: ['', Validators.required],
    total: [{ value: '', disabled: true }],
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
    this.xmlService.cancelCurrentRequest();
    this.ocrService.cancelCurrentRequest();
    this.invoiceForm.reset({
      type: '',
      issueDate: '',
      consecutive: '',
      key: '',
      identification: '',
      name: '',
      lastName: '',
      email: ''
    });

    this.detailForm.reset({
      category: '',
      tax: ''
    });

    if (this.inputFileForm) {
      this.inputFileForm.removeFile();
    }

    this.hideModal();
  }

  saveInvoice(item: IManualInvoice) {
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

  handleScanFile(file: File) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'xml') {
      this.xmlService.scanFile(file, this.type);
    } else {
      this.ocrService.scanFile(file, this.type);
    }
  }

  callCancel() {
    this.details = [];
    this.detailForm.reset({
      category: '',
      tax: null,
    });
    this.invoiceForm.reset({
      type: '',
    });
  }
}