import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGoals } from '../../interfaces';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goals.component.html'
})
export class GoalsComponent {
  private fb = inject(FormBuilder);
  
  public showGoalsForm = false;
  public goals: IGoals[] = [];
  
  public goalsForm: FormGroup = this.fb.group({
    declaration: ['', Validators.required],
    type: ['', Validators.required],
    date: ['', Validators.required],
    Objective: ['', Validators.required]
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
    { value: 'improve_compliance', label: 'Mejorar cumplimiento tributario' },
    { value: 'reduce_penalties', label: 'Reducir multas y sanciones' }
  ];

  constructor() {
    this.loadGoals();
  }

  openGoalsForm() {
    this.showGoalsForm = true;
    this.goalsForm.reset();
  }

  closeGoalsForm() {
    this.showGoalsForm = false;
    this.goalsForm.reset();
  }

  onSubmit() {
    if (this.goalsForm.valid) {
      const newGoal: IGoals = {
        id: Date.now(),
        ...this.goalsForm.value,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      this.goals.push(newGoal);
      this.saveGoals();
      this.closeGoalsForm();
    }
  }

  

  deleteGoal(id: number) {
    this.goals = this.goals.filter(goal => goal.id !== id);
    this.saveGoals();
  }

  updateGoalStatus(id: number, status: IGoals['status']) {
    const goal = this.goals.find(g => g.id === id);
    if (goal) {
      goal.status = status;
      this.saveGoals();
    }
  }

  private saveGoals() {
    localStorage.setItem('tax_goals', JSON.stringify(this.goals));
  }

  private loadGoals() {
    const stored = localStorage.getItem('tax_goals');
    if (stored) {
      this.goals = JSON.parse(stored);
    }
  }

  get submitButtonText(): string {
    return 'Crear';
  }

  get isFormValid(): boolean {
    return this.goalsForm.valid;
  }

  getDeclarationLabel(value: string): string {
    return this.declarationOptions.find(opt => opt.value === value)?.label || value;
  }

  getTaxTypeLabel(value: string): string {
    return this.taxTypeOptions.find(opt => opt.value === value)?.label || value;
  }

  getObjectiveLabel(value: string): string {
    return this.objectiveOptions.find(opt => opt.value === value)?.label || value;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completada';
      default: return status;
    }
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'pending': return 'bg-burnt-umber text-bisque';
      case 'in-progress': return 'bg-golden-glow text-flamenco';
      case 'completed': return 'bg-flamenco text-bisque';
      default: return 'bg-zorba text-bisque';
    }
  }
}
