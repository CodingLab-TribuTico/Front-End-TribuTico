import { Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { IDetailInvoice } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { ModalService } from '../../services/modal.service';
import { NgbSlide } from "../../../../node_modules/@ng-bootstrap/ng-bootstrap/carousel/carousel";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, ModalComponent, LoaderComponent],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {

  private invoiceService: InvoiceService = inject(InvoiceService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(ModalService);

  @ViewChild('confirmationModal') public confirmationModal: any;

  invoice = this.invoiceService.currentInvoice$;


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.invoiceService.getById(Number(id));
    }
  }

  onBack(): void {
    this.invoiceService.clearCurrentInvoice();
    this.router.navigate(['/app/invoice']);
  }

  openDeleteModal(): void {
    this.modalService.displayModal(this.confirmationModal);
  }

  hideModal(): void {
    this.modalService.closeAll();
  }

  deleteInvoice(): void {
    const currentInvoice = this.invoiceService.currentInvoice$();
    if (currentInvoice) {
      this.invoiceService.delete(currentInvoice);
      this.hideModal();
      this.onBack();
    }
  }

  calculateTotal(details?: IDetailInvoice[]): number {
    if (!details || details.length === 0) return 0;
    return details.reduce((sum, item) => sum + (item.total || 0), 0);
  }
  calculateSubtotal(details: any[]): number {
    return details?.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) || 0;
  }

  calculateTotalTaxes(details: any[]): number {
    return details?.reduce((acc, item) => acc + (item.taxAmount || 0), 0) || 0;
  }

}
