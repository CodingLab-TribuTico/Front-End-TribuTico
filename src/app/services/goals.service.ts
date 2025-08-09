import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IResponse, IGoals } from "../interfaces";
import { AlertService } from "./alert.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class GoalsService {
  private http: HttpClient = inject(HttpClient);
  private alertService: AlertService = inject(AlertService);
  private authService: AuthService = inject(AuthService);
  private goalsList = signal<IGoals[]>([]);
  private currentGoal = signal<IGoals | null>(null);
  private goalsByUserIdList = signal<IGoals[]>([]);

  get goals$() {
    return this.goalsList;
  }

  get currentGoal$() {
    return this.currentGoal;
  }

  get goalsByUserId$() {
    return this.goalsByUserIdList;
  }

  createGoal(goal: IGoals) {
    return this.http.post<IResponse<IGoals>>('/goals', goal);
  }

  getGoalsByUserId(userId: number) {
    this.http.get<IResponse<IGoals[]>>(`/goals/user/${userId}`).subscribe({
      next: (response: IResponse<IGoals[]>) => {
        this.goalsByUserIdList.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al recuperar las metas');
      },
    });
  }

  deleteGoal(goalId: number) {
    return this.http.delete<IResponse<void>>(`/goals/${goalId}`);
  }

  save(item: IGoals) {
    const currentUserId = this.authService.getCurrentUserId();
    
    if (!currentUserId) {
      this.alertService.showAlert("error", "Usuario no autenticado");
      return;
    }

    // Preparar los datos para el backend
    const goalData = {
      user: { id: currentUserId },
      declaration: item.declaration,
      type: item.type,
      objective: item.Objective, // Cambiar de Objective a objective
      date: item.date
    };

    this.createGoal(goalData as any).subscribe({
      next: (response: IResponse<IGoals>) => {
        this.alertService.showAlert("success", response.message);
      },
      error: (error) => {
        console.error('Error al crear meta:', error);
        this.alertService.showAlert("error", "Ocurrió un error al guardar la meta");
      },
    });
  }
  
}