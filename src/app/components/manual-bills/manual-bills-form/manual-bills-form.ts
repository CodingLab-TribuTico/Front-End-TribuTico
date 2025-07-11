import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IManualBill } from '../../../interfaces';

@Component({
  selector: 'app-manual-bills-form',
  templateUrl: './manual-bills-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
})
export class ManualBillsFormComponent {
    public fb: FormBuilder = inject(FormBuilder);
    @Input() form!: FormGroup;
    @Output() callsavedMethod: EventEmitter<IManualBill> = new EventEmitter<IManualBill>();

    callSave(){
      let manualBill: IManualBill = {
        consecutive: this.form.controls["consecutivo"].value,
        code: this.form.controls["codigo"].value,
        issueDate: this.form.controls["issueDate"].value,
        userId: this.form.controls[""].value,
        details: this.form.controls["detalle"].value,

      };
    }
}