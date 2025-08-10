import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IDetailInvoice, IManualInvoice, IInvoiceUser } from '../../../interfaces';
import { CardDetailComponent } from '../../card-detail/card-detail.component';

@Component({
  selector: "app-manual-invoices-form",
  templateUrl: "./manual-invoices-form.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardDetailComponent,
  ],
})
export class ManualInvoicesFormComponent implements OnInit {
  public fb: FormBuilder = inject(FormBuilder);

  @Input() invoiceForm!: FormGroup;
  @Input() detailForm!: FormGroup;
  @Input() responseScan!: any;
  @Input() details: IDetailInvoice[] = [];
  @Input() textConfirmButton: string = 'Confirmar';
  @Output() callSavedMethod = new EventEmitter<IManualInvoice>();
  @Output() callResetScanMethod = new EventEmitter<any>();
  @Output() callUpdateMethod = new EventEmitter<IManualInvoice>();
  @Output() callCancelMethod = new EventEmitter<void>();
  @Input() isEditing: boolean = false;

  public isEditingDetail = false;
  public editingIndex = -1;
  private originalDetailsBackup: IDetailInvoice[] = [];
  private backupDetail?: IDetailInvoice;

  public showDeleteModal = false;
  public indexToDelete = -1;

  public typeInvoice: string = 'ingreso';

  public keyCategories: string[] = [
    "VG-B", "VG-S", "VE", "VX", "EXP", "CBG", "CSG", "CX", "CBR", "CSR", "GSP", "GA", "SPS", "HP", "GV",
    "PP", "ALO", "MR", "CAF", "GF", "GS", "NCE", "NCR", "DON", "MUL"
  ];

  public categories: Record<string, string> = {
    "VG-B": "Venta Gravada de Bienes (13%)",
    "VG-S": "Venta Gravada de Servicios (13%)",
    "VE": "Venta Exenta (Ley u oficio)",
    "VX": "Venta Exonerada (usuario final exonerado)",
    "EXP": "Exportación de Bienes o Servicios",
    "CBG": "Compra de Bienes Gravados (con derecho a crédito fiscal)",
    "CSG": "Compra de Servicios Gravados (con derecho a crédito fiscal)",
    "CX": "Compra Exenta o Exonerada (sin derecho a crédito)",
    "CBR": "Compra de Bienes con Tarifa Reducida (1%, 2%)",
    "CSR": "Compra de Servicios con Tarifa Reducida (1%, 2%)",
    "GSP": "Gasto de Servicios Públicos - Gravado",
    "GA": "Gasto Administrativo - Gravado",
    "SPS": "Servicios Profesionales Subcontratados - Gravado",
    "HP": "Honorarios Profesionales - Gravado",
    "GV": "Gasto de Transporte o Viáticos - Gravado",
    "PP": "Publicidad y Promoción - Gravado",
    "ALO": "Alquiler de Local u Oficina",
    "MR": "Mantenimiento y Reparaciones - Gravado",
    "CAF": "Compra de Activos Fijos - IVA prorrateable",
    "GF": "Gasto Financiero - No lleva IVA",
    "GS": "Gasto Salarial - No lleva IVA",
    "NCE": "Notas de Crédito Emitidas",
    "NCR": "Notas de Crédito Recibidas",
    "DON": "Donación Deducible - No lleva IVA",
    "MUL": "Multas, Sanciones o Gastos No Deducibles"
  };

  ngOnInit() {
    this.originalDetailsBackup = JSON.parse(JSON.stringify(this.details));
  }

  constructor() {
    effect(() => {
      if (!this.responseScan) return;
      const response = this.responseScan();
      this.fillInvoiceFromAutocomplete(response);
      this.callResetScanMethod.emit();
    });
  }

  callSave() {
    const type = this.invoiceForm.controls["type"].value;

    const invoiceUser: IInvoiceUser = {
      identification: this.invoiceForm.controls["identification"].value,
      name: this.invoiceForm.controls["name"].value,
      lastName: this.invoiceForm.controls["lastName"].value,
      email: this.invoiceForm.controls["email"].value,
    };

    let manualInvoice: IManualInvoice = {
      type,
      consecutive: this.invoiceForm.controls["consecutive"].value,
      key: this.invoiceForm.controls["key"].value,
      issueDate: this.invoiceForm.controls["issueDate"].value,
      details: this.details,
    };

    if (type === 'ingreso') {
      manualInvoice.receiver = invoiceUser;
    } else {
      manualInvoice.issuer = invoiceUser;
    }

    if (this.invoiceForm.controls["id"].value) {
      manualInvoice.id = this.invoiceForm.controls["id"].value;
    }

    if (manualInvoice.id) {
      this.callUpdateMethod.emit(manualInvoice);
    } else {
      this.callSavedMethod.emit(manualInvoice);
      this.invoiceForm.reset();
    }

    this.originalDetailsBackup = JSON.parse(JSON.stringify(manualInvoice.details));
    this.details = [];
    this.detailForm.reset({ category: '', tax: '' });
    this.invoiceForm.reset({ type: '' });
  }

  callSaveDetail() {
    const form = this.detailForm.controls;
    const detail: IDetailInvoice = {
      cabys: form["cabys"].value,
      quantity: form["quantity"].value,
      unit: form["unit"].value,
      unitPrice: form["unitPrice"].value,
      discount: form["discount"].value,
      tax: form["tax"].value,
      taxAmount: (form["quantity"].value * form["unitPrice"].value * form["tax"].value) / 100,
      category: form["category"].value,
      total: form["total"].value,
      description: form["description"].value,
    };

    this.details.push(detail);

    this.detailForm.reset({ category: '', tax: '' });
    this.isEditingDetail = false;
  }

  fillInvoiceFromAutocomplete(response: any) {
    if (!response) return;
    const data = response.data || response;
    this.updateFormForType(data);
  }

  updateFormForType(data: any) {
    const person = data.receiver || data.issuer || {};
    let firstName = '', lastName = '';

    if (person.name) {
      const fullName = person.name.trim().split(/\s+/);
      firstName = fullName[0];
      lastName = fullName.slice(1).join(' ');
    }

    this.typeInvoice = data.type === "ingreso" ? 'ingreso' : 'gasto';

    this.invoiceForm.patchValue({
      type: data.type || '',
      consecutive: data.consecutive || '',
      key: data.key || '',
      issueDate: data.issueDate || '',
      identification: person.identification || '',
      name: firstName,
      lastName: lastName,
      email: person.email || ''
    });

    this.details = [];

    if (data.details?.length) {
      const firstDetail = data.details[0];
      this.detailForm.patchValue({
        cabys: firstDetail.cabys || '',
        quantity: firstDetail.quantity || 0,
        unit: firstDetail.unit || '',
        unitPrice: firstDetail.unitPrice || 0,
        discount: firstDetail.discount || 0,
        tax: firstDetail.tax || 0,
        category: firstDetail.category || '',
        description: firstDetail.description || ''
      });
      this.calculateTotal();
    } else {
      this.detailForm.reset({ category: '', tax: '' });
    }
  }

  calculateTotal(): void {
    const quantity = this.detailForm.get('quantity')?.value;
    const unitPrice = this.detailForm.get('unitPrice')?.value;
    const discount = this.detailForm.get('discount')?.value;
    const tax = this.detailForm.get('tax')?.value;
    const taxAmount = (quantity * unitPrice * tax) / 100;

    const subtotal = quantity * unitPrice;
    const total = subtotal - discount + taxAmount;

    this.detailForm.get('total')?.setValue(total);
  }

  callCancel() {
    this.details.length = 0;
    this.details.push(...JSON.parse(JSON.stringify(this.originalDetailsBackup)));
    this.callCancelMethod.emit();
  }

  editDetailItem(index: number) {
    const detail = this.details[index];
    this.backupDetail = { ...detail };

    this.detailForm.patchValue(detail);

    this.details.splice(index, 1);
    this.calculateTotal();

    this.isEditingDetail = true;
    this.editingIndex = index;
  }

  cancelEdit() {
    if (this.backupDetail && this.editingIndex >= 0) {
      this.details.splice(this.editingIndex, 0, this.backupDetail);
    }

    this.detailForm.reset(
      {
        tax: '',
        category: ''
      }
    );
    this.isEditingDetail = false;
    this.editingIndex = -1;
    this.backupDetail = undefined;
  }

  deleteDetailItem(index: number) {
    this.indexToDelete = index;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.indexToDelete >= 0) {
      this.details.splice(this.indexToDelete, 1);
      this.indexToDelete = -1;
    }
    this.hideDeleteModal();
  }

  hideDeleteModal() {
    this.showDeleteModal = false;
    this.indexToDelete = -1;
  }

  changeType(event: Event) {
    const selectedType = (event.target as HTMLSelectElement).value;
    this.typeInvoice = selectedType === 'ingreso' ? 'ingreso' : 'gasto';
  }
}