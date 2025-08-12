import { Component, EventEmitter, computed, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGoals } from '../../interfaces';
import { LlamaLoaderComponent } from '../llama-loader/llama-loader.component';
import { GoalsService } from '../../services/goals.service';

@Component({
  selector: 'app-goals-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LlamaLoaderComponent],
  templateUrl: './goals-form.component.html'
})
export class GoalsFormComponent {
  private fb = inject(FormBuilder);
  private goalsService = inject(GoalsService);
  
  public isLoadingOllama = computed(() => {
    return this.goalsService.isLoadingOllama();
  });

  @Output() saveGoal = new EventEmitter<IGoals>();
  @Output() cancelForm = new EventEmitter<void>();
  
  public goalsForm: FormGroup = this.fb.group({
    declaration: ['', Validators.required],
    type: ['IVA', Validators.required],
    date: ['2025-06-28', Validators.required],
    objective: ['reduce_10_iva', Validators.required]
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
    { value: 'Reducir en un 10% el monto del IVA', label: 'Reducir en un 10% el monto del IVA' },
    { value: 'Reducir en un 15% el monto del ISR', label: 'Reducir en un 15% el monto del ISR' },
    { value: 'Optimizar deducciones fiscales', label: 'Optimizar deducciones fiscales' },
    { value: 'Maximizar beneficios por gastos médicos', label: 'Maximizar beneficios por gastos médicos' },
    { value: 'Aprovechar exenciones de IVA', label: 'Aprovechar exenciones de IVA' },
    { value: 'Reducir carga tributaria en un 20%', label: 'Reducir carga tributaria en un 20%' },
    { value: 'Presentar declaraciones a tiempo', label: 'Presentar declaraciones a tiempo' },
    { value: 'Evitar multas y recargos', label: 'Evitar multas y recargos' },
    { value: 'Mantener registro contable ordenado', label: 'Mantener registro contable ordenado' },
    { value: 'Cumplir con obligaciones mensuales', label: 'Cumplir con obligaciones mensuales' },
    { value: 'Planificar pagos trimestrales de ISR', label: 'Planificar pagos trimestrales de ISR' },
    { value: 'Establecer reserva para impuestos', label: 'Establecer reserva para impuestos' },
    { value: 'Optimizar flujo de efectivo tributario', label: 'Optimizar flujo de efectivo tributario' },
    { value: 'Proyectar carga fiscal anual', label: 'Proyectar carga fiscal anual' }, 
    { value: 'Recuperar saldo a favor de IVA', label: 'Recuperar saldo a favor de IVA' },
    { value: 'Aprovechar incentivos fiscales', label: 'Aprovechar incentivos fiscales' },
    { value: 'Revisar régimen tributario actual', label: 'Revisar régimen tributario actual' },
    { value: 'Implementar facturación electrónica', label: 'Implementar facturación electrónica' }
  ];

  onSubmit() {
    if (this.goalsForm.valid) {
      const newGoal: IGoals = {
        id: Date.now(),
        declaration: this.goalsForm.value.declaration,
        type: this.goalsForm.value.type,
        date: this.goalsForm.value.date,
        objective: this.goalsForm.value.objective,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      this.goalsService.save(newGoal);
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
      objective: 'reduce_10_iva'
    });
  }

  get isFormValid(): boolean {
    return this.goalsForm.valid;
  }

  
}
