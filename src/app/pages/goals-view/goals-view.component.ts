import { Component, inject } from "@angular/core";
import { GoalsListComponent } from "../../components/goals-list/goals-list.component";
import { GoalsService } from "../../services/goals.service";
import { IGoals } from "../../interfaces";
import { LoaderComponent } from "../../components/loader/loader.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-goals-view",
  standalone: true,
  imports: [
    GoalsListComponent,
    LoaderComponent
  ],
  templateUrl: "./goals-view.component.html",
})
export class GoalsViewComponent {
  public goalsService: GoalsService = inject(GoalsService);
  public router = inject(Router);

  constructor() {
    this.goalsService.search.page = 1;
    this.goalsService.search.size = 5;
    this.goalsService.getAll();
  }

  onDeleteGoal(goal: IGoals) {
    this.goalsService.delete(goal);
  }

   search(event: Event) {
    let input = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.goalsService.search.page = 1;
    this.goalsService.search.search = input;
    this.goalsService.getAll();
  }

  goBack() {
    this.router.navigate(['/app/goals']); 
  }
}