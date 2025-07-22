import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IDetailInvoice, IManualInvoice, IInvoiceUser } from '../../../interfaces';
import { CardDetailComponent } from '../../card-detail/card-detail.component';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: "app-manual-invoices-form",
  templateUrl: "./manual-invoices-form.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardDetailComponent,
    ModalComponent
  ],
})
export class ManualInvoicesFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() invoiceForm!: FormGroup;
  @Input() detailForm!: FormGroup;
  @Input() responseScan!: any;
  @Input() details: IDetailInvoice[] = [];
  @Output() callSavedMethod: EventEmitter<IManualInvoice> = new EventEmitter<IManualInvoice>();
  @Output() callResetScanMethod: EventEmitter<any> = new EventEmitter<any>();
  public type = signal<'ingreso' | 'gasto'>('ingreso');
  @Output() callUpdateMethod = new EventEmitter<IManualInvoice>();
  @Output() callCancelMethod = new EventEmitter<void>();
  @Input() isEditing: boolean = false;


  //variables para la edicion
  public isEditingDetail: boolean = false;
  public editingIndex: number = -1;

  // Variables para el modal de confirmación
  public showDeleteModal: boolean = false;
  public indexToDelete: number = -1;

  constructor() {
    effect(() => {
      if (!this.responseScan) return;
      const response = this.responseScan();
      const currentType = this.type();

      if (response) {
        const typeToUse = response.type || currentType;
        this.fillInvoiceFromAutocomplete(response, typeToUse);
      }
    });
  }

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

    this.details = [];
    this.detailForm.reset({
      category: '',
      tax: '',
    });
    this.invoiceForm.reset({
      type: '',
    });
  }

  callSaveDetail() {
    let detail: IDetailInvoice = {
      cabys: this.detailForm.controls["cabys"].value,
      quantity: this.detailForm.controls["quantity"].value,
      unit: this.detailForm.controls["unit"].value,
      unitPrice: this.detailForm.controls["unitPrice"].value,
      discount: this.detailForm.controls["discount"].value,
      tax: this.detailForm.controls["tax"].value,
      taxAmount: (this.detailForm.controls["quantity"].value * this.detailForm.controls["unitPrice"].value * this.detailForm.controls["tax"].value) / 100,
      category: this.detailForm.controls["category"].value,
      total: this.detailForm.controls["total"].value,
      description: this.detailForm.controls["description"].value,
    };


    // Agregar nuevo detalle
    this.details.push(detail);

    // this.details.push(detail);
    this.detailForm.reset({
      category: '',
      tax: '',
    });
  }

  fillInvoiceFromAutocomplete(response: any, type: 'ingreso' | 'gasto') {
    console.log('Respuesta completa:', response);
    if (!response) return;

    const data = response.data || response;

    console.log('Datos recibidos:', data);

    this.updateFormForType(type, data);

  }

  updateFormForType(type: string, data: any) {
    const personData = type === 'ingreso' ? data.receiver : data.issuer;
    const person = personData || {};

    let firstName = '';
    let lastName = '';
    if (person.name) {
      const fullName = person.name.trim().split(/\s+/);
      if (fullName.length > 0) {
        firstName = fullName[0];
        lastName = fullName.slice(2).join(' ');
      }
    }

    this.invoiceForm.patchValue({
      type: type,
      consecutive: data.consecutive || '',
      key: data.key || '',
      issueDate: data.issueDate || '',
      identification: person.identification || '',
      name: firstName,
      lastName: lastName,
      email: person.email || ''
    });

    this.details = [];

    if (data.details && data.details.length > 0) {
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
      this.detailForm.reset({
        category: '',
        tax: ''
      });
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
    this.callCancelMethod.emit();
  }

  changeType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.type.set(selectElement.value as 'ingreso' | 'gasto');

    this.invoiceForm.patchValue({
      identification: '',
      name: '',
      lastName: '',
      email: ''
    });
  }



  editDetailItem(index: number) {
    const detail = this.details[index];


    this.detailForm.patchValue({
      cabys: detail.cabys,
      quantity: detail.quantity,
      unit: detail.unit,
      unitPrice: detail.unitPrice,
      discount: detail.discount,
      tax: detail.tax,
      category: detail.category,
      description: detail.description
    });

    this.details.splice(index, 1);

    this.calculateTotal();

    this.isEditingDetail = true;
    this.editingIndex = index;
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
}