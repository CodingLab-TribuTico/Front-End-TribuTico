import {
  Component,
  inject,
} from "@angular/core";
import { GoalsService } from "../../services/goals.service";
import { FormBuilder, Validators } from "@angular/forms";
import { IGoals } from "../../interfaces";
import { GoalsFormComponent } from "../../components/goals-form/goals-form.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-goals",
  standalone: true,
  imports: [
    GoalsFormComponent,
    RouterModule
  ],
  templateUrl: "./goals.component.html",
})
export class GoalsComponent {
  public goalsService: GoalsService = inject(GoalsService);
  public title: string = "Metas Tributarias";
  public fb: FormBuilder = inject(FormBuilder);

  public goalsForm = this.fb.group({
    id: [''],
    declaration: ['', Validators.required],
    type: ['IVA', Validators.required],
    date: ['2025-06-28', Validators.required],
    objective: ['reduce_10_iva', Validators.required],
    status: ['pending']
  });

  constructor() {
    // carga de facturas pendiente
  }

  saveGoal(goal: IGoals) {
    this.goalsService.save(goal);
  }

  cancelForm() {
    this.goalsForm.reset();
  }
}