import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { IFiscal } from '../../interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fiscal-calendar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fiscal-calendar-form.component.html',
})
export class FiscalCalendarFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() fiscalCalendarForm!: FormGroup;
  @Input() cancelOption: boolean = false;
  @Input() isEditMode: boolean = false;
  @Output() callSaveMethod: EventEmitter<IFiscal> = new EventEmitter<IFiscal>();
  @Output() callUpdateMethod: EventEmitter<IFiscal> = new EventEmitter<IFiscal>();
  @Output() callCancelMethod: EventEmitter<void> = new EventEmitter<void>();

  notificationTypes = [
    { value: 'IVA', label: 'IVA' },
    { value: 'Renta', label: 'Renta' },
  ];

  callSave() {
    if (this.fiscalCalendarForm.invalid) {
      return;
    }

    const fiscal: IFiscal = {
      id: this.fiscalCalendarForm.controls['id']?.value,
      name: this.fiscalCalendarForm.controls['name'].value,
      description: this.fiscalCalendarForm.controls['description'].value,
      taxDeclarationDeadline: this.fiscalCalendarForm.controls['date'].value,
      type: this.fiscalCalendarForm.controls['type'].value
    };

    if (this.isEditMode && fiscal.id) {
      this.callUpdateMethod.emit(fiscal);
    } else {
      this.callSaveMethod.emit(fiscal);
    }
  }

  callCancel() {
    this.callCancelMethod.emit();
  }
}
