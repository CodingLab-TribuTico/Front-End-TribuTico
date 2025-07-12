import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IManualBill } from '../../../interfaces';

@Component({
  selector: "app-manual-bills-form",
  templateUrl: "./manual-bills-form.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
})
export class ManualBillsFormComponent {
    public fb: FormBuilder = inject(FormBuilder);
    @Input() form!: FormGroup;
    @Output() callSavedMethod: EventEmitter<IManualBill> = new EventEmitter<IManualBill>();

    callSave(){
      let manualBill: IManualBill = {
        consecutive: this.form.controls["consecutive"].value,
        code: this.form.controls["codigo"].value,
        issueDate: this.form.controls["issueDate"].value,
        users: this.form.controls["users"].value,
        details: this.form.controls["details"].value,

      };
      if(this.form.controls["id"].value){
        manualBill.id = this.form.controls["id"].value;
      }
      if(manualBill.id){
        this.callSavedMethod.emit(manualBill);
      }
    }
}