import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IResponse, IGoals, ISearch } from "../interfaces";
import { AlertService } from "./alert.service";
import { AuthService } from "./auth.service";
import { BaseService } from "./base-service";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GoalsService extends BaseService<IGoals> {
  protected override source: string = 'goals';
  protected override http: HttpClient = inject(HttpClient);
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

  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  };
  public totalItems: any = [];

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

    this.isLoadingOllama.set(true); // ← Activar loading

    const goalData = {
      user: { id: currentUserId },
      declaration: item.declaration,
      type: item.type,
      objective: item.objective,
      date: item.date,
      recommendations: item.recommendations
    };

    this.createGoal(goalData as any).subscribe({
      next: (response: IResponse<IGoals>) => {
        this.alertService.showAlert("success", response.message);
        this.isLoadingOllama.set(false); // ← Desactivar loading
      },
      error: (error) => {
        this.alertService.showAlert("error", "Ocurrió un error al guardar la meta");
        this.isLoadingOllama.set(false);
      },
    });
  }

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size, search: this.search.search }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.goalsList.set(response.data);
      },
      error: (err: any) => {
        this.alertService.showAlert('error', err);
      }
    });
  }

  delete(goal: IGoals) {
    this.delCustomSource(`${goal.id}`).subscribe({
      next: (response: any) => {
        this.goalsList.update(goals => goals.filter(g => g.id !== goal.id));
        this.alertService.showAlert('success', response.message);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al eliminar la meta');
      }
    });
  }

  public isLoading = signal(false);
  public isLoadingOllama = signal(false);


}