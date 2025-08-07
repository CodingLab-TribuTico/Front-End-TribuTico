import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { ModalComponent } from "../../components/modal/modal.component";
import { ModalService } from "../../services/modal.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IsrSimulationService } from "../../services/isr-simulation.service";
import { IvaSimulationComponent } from "../../components/iva-simulation/iva-simulation.component";
import { IIvaCalculation } from "../../interfaces";
import { IvaSimulationService } from "../../services/iva-simulation.service";
import { AssetsLiabilitiesComponent } from "../../components/isr-simulation/assets-and-liabilities/assets-liabilities.component";
import { IncomeComponent } from "../../components/isr-simulation/income/income.component";
import { CostsExpensesDeductionsComponent } from "../../components/isr-simulation/costs-expenses-deductions/costs-expenses-deductions.component";
import { TaxBaseComponent } from "../../components/isr-simulation/tax-base/tax-base.component";
import { CreditsComponent } from "../../components/isr-simulation/credits/credits.component";
import { SettlementTaxDebtComponent } from "../../components/isr-simulation/settlement-tax-debt/settlement-tax-debt.component";
import { GeneralDataComponent } from "../../components/isr-simulation/general-data/general-data.component";
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: 'app-simulation-detail',
  standalone: true,
  imports: [
    CommonModule, 
    ModalComponent,
    LoaderComponent,
    IvaSimulationComponent,
    AssetsLiabilitiesComponent, 
    IncomeComponent, 
    CostsExpensesDeductionsComponent, 
    TaxBaseComponent, 
    CreditsComponent, 
    SettlementTaxDebtComponent,
    GeneralDataComponent
  ],
  templateUrl: './simulation-detail.component.html',
})
export class SimulationDetailComponent implements OnInit {
  public route = inject(ActivatedRoute);
  public router = inject(Router);
  public isrSimulationService = inject(IsrSimulationService);
  public ivaSimulationService = inject(IvaSimulationService);
  public modalService = inject(ModalService);
  @ViewChild('confirmationModal') public confirmationModal: any;

  currentSimulationIva = this.ivaSimulationService.currentIvaSimulation$;
  currentSimulationIsr = this.isrSimulationService.currentIsrSimulation$;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const type = this.route.snapshot.paramMap.get('type');

    if (!id || !type) {
      this.router.navigate(['/app/simulation-view']);
      return;
    }
    
    if (type === 'isr') {
      this.isrSimulationService.getById(id);
      this.ivaSimulationService.clearCurrentSimulation(); 
    } else if (type === 'iva') {
      this.ivaSimulationService.getById(id);
      this.isrSimulationService.clearCurrentSimulation(); 
    }
  }

  onBack(): void {
    this.isrSimulationService.clearCurrentSimulation();
    this.router.navigate(['/app/simulation-view']);
  }

  openDeleteModal(): void {
    this.modalService.displayModal(this.confirmationModal);
  }

  hideModal(): void {
    this.modalService.closeAll();
  }

  deleteSimulation(): void {
    const currentSimulation = this.isrSimulationService.currentIsrSimulation$();
    if (currentSimulation) {
      this.isrSimulationService.delete(currentSimulation);
      this.hideModal();
      this.onBack();
    }
  }

  getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || 'Mes desconocido';
  }

  getIvaSimulationPeriod(simulation: IIvaCalculation): string {
    const monthName = this.getMonthName(simulation.month);
    return `${monthName} ${simulation.year}`;
  }

  getIvaSimulationName(): string {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    return `${user.name || ''} ${user.lastname || ''}`.trim();
  }

  getIvaSimulationIdentification(): string {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    return user.identification || '';
  }
  
}

