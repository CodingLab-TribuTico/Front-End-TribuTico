import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IDetailInvoice, IManualInvoice } from '../../../interfaces';
import { CardDetailComponent } from '../../card-detail/card-detail.component';

@Component({
  selector: "app-manual-invoices-form",
  templateUrl: "./manual-invoices-form.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardDetailComponent
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
  public type: string = 'ingreso';

  constructor() {
    effect(() => {
      const response = this.responseScan();
      if (response) {
        this.fillInvoiceFromAutocomplete(response);
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

    const person = {
      identification: this.invoiceForm.controls["identification"].value,
      name: this.invoiceForm.controls["name"].value,
      lastname: this.invoiceForm.controls["lastname"].value,
      email: this.invoiceForm.controls["email"].value,
    };

    const userLocal = localStorage.getItem("auth_user");
    const user = {
      identification: userLocal ? JSON.parse(userLocal).identification : null,
      name: userLocal ? JSON.parse(userLocal).name : null,
      lastname: userLocal ? JSON.parse(userLocal).lastname : null,
      email: userLocal ? JSON.parse(userLocal).email : null,
    }

    let manualInvoice: IManualInvoice = {
      type,
      consecutive: this.invoiceForm.controls["consecutive"].value,
      key: this.invoiceForm.controls["key"].value,
      issueDate: this.invoiceForm.controls["issueDate"].value,
      name: this.invoiceForm.controls["name"].value,
      lastname: this.invoiceForm.controls["lastname"].value,
      email: this.invoiceForm.controls["email"].value,
      identification: this.invoiceForm.controls["identification"].value,
      details: this.details,
    };

    if (this.invoiceForm.controls["id"].value) {
      manualInvoice.id = this.invoiceForm.controls["id"].value;
    }

    this.callSavedMethod.emit(manualInvoice);
    this.details = [];
    this.detailForm.reset({
      category: '',
      tax: '',
    });
    this.invoiceForm.reset({
      type: '',
    });
    this.type = 'ingreso';
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

    this.details.push(detail);
    this.detailForm.reset({
      category: '',
      tax: '',
    });
  }

  fillInvoiceFromAutocomplete(response: any) {
    console.log(response);
    if (response.data !== undefined) {
      const data = response.data;
      const type = data.type || 'ingreso';
      this.type = type;
      const person = type === 'ingreso' ? data.receiver : data.issuer;

      this.invoiceForm.controls['type'].setValue(data.type ?? '');
      this.invoiceForm.controls['consecutive'].setValue(data.consecutive ?? '');
      this.invoiceForm.controls['key'].setValue(data.key ?? '');

      this.invoiceForm.controls['issueDate'].setValue(data.issueDate ?? '');

      this.invoiceForm.controls['identification'].setValue(person?.identification ?? '');
      this.invoiceForm.controls['name'].setValue(person?.name ?? '');
      this.invoiceForm.controls['lastname'].setValue(person?.lastname ?? '');
      this.invoiceForm.controls['email'].setValue(person?.email ?? '');

      this.details = data.details || [];
      this.callResetScanMethod.emit();
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
    this.details = [];
    this.detailForm.reset({
      category: '',
      tax: '',
    });
    this.invoiceForm.reset({
      type: '',
    });
  }

  changeType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.type = selectElement.value;
  }
}