import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from "@angular/core";
import { InvoiceService } from "../../services/invoice.service";
import { ModalService } from "../../services/modal.service";
import { FormBuilder, Validators } from "@angular/forms";
import { IManualInvoice } from "../../interfaces";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { InvoiceListComponent } from "../../components/invoice-list/invoice-list.component";
import { ManualInvoicesFormComponent } from "../../components/manual-invoices/manual-invoices-form/manual-invoices-form.component";

@Component({
  selector: "app-invoice",
  standalone: true,
  imports: [
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    InvoiceListComponent,
    ManualInvoicesFormComponent,
  ],
  templateUrl: "./invoice.component.html",
  styleUrl: "./invoice.component.scss",
})
export class InvoiceComponent {
  public invoiceService: InvoiceService = inject(InvoiceService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild("addInvoiceModal") public addInvoiceModal: any;
  public title: string = "Facturas";
  public fb: FormBuilder = inject(FormBuilder);
  @Output() callCustomSearchMethod = new EventEmitter();

  invoiceForm = this.fb.group({
    id: [""],
    consecutive: ["", Validators.required],
    issueDate: ["", Validators.required],
    receiver: this.fb.group({
      identification: ["", Validators.required],
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    }),
    user: this.fb.group({
      birthDate: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    }),
  });

  constructor() {
    this.invoiceService.search.page = 1;
    this.invoiceService.search.size = 10;
    this.invoiceService.getAll();
  }

  saveInvoice(invoice: IManualInvoice) {
    this.invoiceService.save(invoice);
    this.modalService.closeAll();
  }

  callEdition(invoice: IManualInvoice) {
    console.log("Editando factura:", invoice);
    this.invoiceForm.patchValue({
      id: invoice.id?.toString(),
      consecutive: invoice.consecutive,
      issueDate: invoice.issueDate,
      receiver: {
        identification: invoice.receiver?.identification,
        name: invoice.receiver?.name,
        email: invoice.receiver?.email,
      },
      user: {
        birthDate: invoice.user?.birthDate,
        email: invoice.user?.email,
      },
    });
    this.modalService.displayModal(this.addInvoiceModal);
  }

  updateInvoice(invoice: IManualInvoice) {
    this.invoiceService.update(invoice);
    this.modalService.closeAll();
  }

  search(event: Event) {
    let input = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.invoiceService.search.page = 1;
    this.invoiceService.search.search = input;
    this.invoiceService.getAll();
  }

  cancelUpdate() {
    this.invoiceForm.reset();
    this.modalService.closeAll();
  }
}
