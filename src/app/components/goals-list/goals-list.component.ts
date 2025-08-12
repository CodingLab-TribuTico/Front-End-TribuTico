import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, ViewChild } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { IGoals } from "../../interfaces";
import { ModalService } from "../../services/modal.service";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-goals-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ModalComponent
  ],
  templateUrl: './goals-list.component.html'
})
export class GoalsListComponent {
  @Input() goals: IGoals[] = [];
  @Output() callDeleteAction: EventEmitter<IGoals> = new EventEmitter<IGoals>();

  @ViewChild("confirmationModal") public confirmationModal: any;
  public modalService: ModalService = inject(ModalService);
  public selectedGoal: IGoals | null = null;

  openDeleteModal(goal: IGoals): void {
    this.selectedGoal = goal;
    this.modalService.displayModal(this.confirmationModal);
  }
  
  hideModal() {
    this.modalService.closeAll();
  }

  deleteGoal(id: IGoals["id"]) {
    this.hideModal();
    const goal = this.goals.find((u) => u.id === id);
    if (goal) {
      this.callDeleteAction.emit(goal);
    }
    this.selectedGoal = null;
  }
  
}


  
