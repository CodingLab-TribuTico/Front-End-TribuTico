import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { ModalComponent } from "../modal/modal.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { IDetailInvoice, IManualInvoice } from "../../interfaces";
import { ModalService } from "../../services/modal.service";

@Component({
  selector: "app-invoice-list",
  standalone: true,
  imports: [CommonModule, MatIconModule, ModalComponent],
  templateUrl: "./invoice-list.component.html",
  styleUrl: "./invoice-list.component.scss",
})
export class InvoiceListComponent {
  @Input() title: string = "";
  @Input() invoices: IManualInvoice[] = [];
  @Output() callModalAction: EventEmitter<IManualInvoice> =
    new EventEmitter<IManualInvoice>();
  @Output() callDeleteAction: EventEmitter<IManualInvoice> =
    new EventEmitter<IManualInvoice>();
  @ViewChild("confirmationModal") public confirmationModal: any;
  public modalService: ModalService = inject(ModalService);
  public selectedInvoice: IManualInvoice | null = null;

  openModal(item: IManualInvoice) {
    this.selectedInvoice = item;
    this.modalService.displayModal(this.confirmationModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }

  deleteInvoice(id: IManualInvoice["id"]) {
    this.hideModal();
    const invoice = this.invoices.find((u) => u.id === id);
    if (invoice) {
      this.callDeleteAction.emit(invoice);
    }
    this.selectedInvoice = null;
  }

  calculateTotal(details?: IDetailInvoice[]): number {
    if (!details || details.length === 0) return 0;
    return details.reduce((sum, item) => sum + (item.total || 0), 0);
  }
}
