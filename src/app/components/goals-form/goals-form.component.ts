import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGoals } from '../../interfaces';

@Component({
  selector: 'app-goals-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goals-form.component.html'
})
export class GoalsFormComponent {
  private fb = inject(FormBuilder);
  
  @Output() saveGoal = new EventEmitter<IGoals>();
  @Output() cancelForm = new EventEmitter<void>();
  
  public goalsForm: FormGroup = this.fb.group({
    declaration: ['', Validators.required],
    type: ['IVA', Validators.required],
    date: ['2025-06-28', Validators.required],
    Objective: ['reduce_10_iva', Validators.required]
  });

  public declarationOptions = [
    { value: 'D104', label: 'D-104 - Declaración del Impuesto al Valor Agregado' },
    { value: 'D101', label: 'D-101 - Declaración Jurada del Impuesto sobre la Renta' },
  ];

  public taxTypeOptions = [
    { value: 'IVA', label: 'IVA' },
    { value: 'ISR', label: 'ISR' },
  ];

  public objectiveOptions = [
    { value: 'reduce_10_iva', label: 'Reducir en un 10% el monto del IVA' },
    { value: 'reduce_15_isr', label: 'Reducir en un 15% el monto del ISR' },
    { value: 'optimize_deductions', label: 'Optimizar deducciones fiscales' },
  ];

  onSubmit() {
    if (this.goalsForm.valid) {
      const newGoal: IGoals = {
        id: Date.now(),
        declaration: this.goalsForm.value.declaration,
        type: this.goalsForm.value.type,
        date: this.goalsForm.value.date,
        Objective: this.goalsForm.value.Objective,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      this.saveGoal.emit(newGoal);
      this.resetForm(); 
    }
  }

  onCancel() {
    this.cancelForm.emit();
    this.resetForm();
  }

  private resetForm() {
    this.goalsForm.patchValue({
      declaration: '',
      type: 'IVA',
      date: '2025-06-28',
      Objective: 'reduce_10_iva'
    });
  }

  get isFormValid(): boolean {
    return this.goalsForm.valid;
  }
}
