import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { InvoiceService } from "../../services/invoice.service";
import { ModalService } from "../../services/modal.service";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { IDetailInvoice, IManualInvoice } from "../../interfaces";
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
  @Output() callCustomSearchMethod = new EventEmitter();
  public details: IDetailInvoice[] = [];
  public fb: FormBuilder = inject(FormBuilder);
  public isEditing: boolean = false;


  public invoiceForm = this.fb.group({
    id: [''],
    type: ['', Validators.required],
    issueDate: ['', Validators.required],
    consecutive: ['', Validators.required],
    key: ['', Validators.required],
    identification: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
  });

  public detailForm = this.fb.group({
    cabys: ['', Validators.required],
    unit: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]],
    unitPrice: ['', [Validators.required, Validators.min(0)]],
    discount: ['', Validators.required],
    tax: ['', [Validators.required, Validators.min(0)]],
    total: [{ value: '', disabled: true }, Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required]
  });

  callEdition(invoice: IManualInvoice) {
    this.invoiceForm.patchValue({
      id: JSON.stringify(invoice.id),
      type: invoice.type,
      consecutive: invoice.consecutive?.toString() || '',
      key: invoice.key,
      issueDate: invoice.issueDate,
      identification: invoice.receiver?.identification,
      name: invoice.receiver?.name,
      lastName: invoice.receiver?.lastName,
      email: invoice.receiver?.email

    });

    this.details = invoice.details ?? [];

    this.modalService.displayModal(this.addInvoiceModal);
  }


  constructor() {
    this.invoiceService.search.page = 1;
    this.invoiceService.search.size = 10;
    this.invoiceService.getAll();
  }

  saveInvoice(invoice: IManualInvoice) {
    this.invoiceService.save(invoice);
    this.modalService.closeAll();
  }

  updateInvoice(invoice: IManualInvoice) {
    this.invoiceService.update(invoice);
    this.modalService.closeAll();
    this.invoiceForm.reset();
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


