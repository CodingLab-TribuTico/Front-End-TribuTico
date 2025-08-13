import {
  Component,
  EventEmitter,
  inject,
  Output,
} from "@angular/core";
import { InvoiceService } from "../../services/invoice.service";
import { ModalService } from "../../services/modal.service";
import { FormBuilder, Validators } from "@angular/forms";
import { IDetailInvoice, IManualInvoice } from "../../interfaces";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { InvoiceListComponent } from "../../components/invoice-list/invoice-list.component";
import { ManualInvoicesFormComponent } from "../../components/manual-invoices/manual-invoices-form/manual-invoices-form.component";

@Component({
  selector: "app-invoice",
  standalone: true,
  imports: [
    PaginationComponent,
    LoaderComponent,
    InvoiceListComponent,
    ManualInvoicesFormComponent,
  ],
  templateUrl: "./invoice.component.html",
})
export class InvoiceComponent {
  public invoiceService: InvoiceService = inject(InvoiceService);
  public modalService: ModalService = inject(ModalService);
  public title: string = "Facturas";
  @Output() callCustomSearchMethod = new EventEmitter();
  public details: IDetailInvoice[] = [];
  public fb: FormBuilder = inject(FormBuilder);
  public isEditing: boolean = false;
  public showEditInvoiceModal: boolean = false;

  public invoiceForm = this.fb.group({
    id: [''],
    type: ['', Validators.required],
    issueDate: ['', Validators.required],
    consecutive: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    key: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    identification: ['', [Validators.required, Validators.pattern(/^(\d{9}|\d{12})$/)]],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  public detailForm = this.fb.group({
    cabys: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
    unit: ['', Validators.required],
    quantity: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
    unitPrice: [null, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    discount: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    tax: ['', Validators.required],
    total: [{ value: '', disabled: true }],
    category: ['', Validators.required],
    description: ['', Validators.required]
  });

  callEdition(invoice: IManualInvoice) {
    const person = invoice.type === 'ingreso' ? invoice.receiver || {} : invoice.type === 'gasto' ? invoice.issuer || {} : {};

    this.invoiceForm.patchValue({
      id: JSON.stringify(invoice.id),
      type: invoice.type,
      consecutive: invoice.consecutive?.toString() || '',
      key: invoice.key,
      issueDate: invoice.issueDate,
      identification: person.identification || '',
      name: person.name || '',
      lastName: person.lastName || '',
      email: person.email || ''
    });

    this.details = invoice.details ?? [];
    this.showEditInvoiceModal = true;
  }

  constructor() {
    this.invoiceService.search.page = 1;
    this.invoiceService.search.size = 5;
    this.invoiceService.getAll();
  }

  saveInvoice(invoice: IManualInvoice) {
    this.invoiceService.save(invoice);
    this.showEditInvoiceModal = false;
  }

  updateInvoice(invoice: IManualInvoice) {
    this.invoiceService.update(invoice);
    this.invoiceForm.reset();
    this.showEditInvoiceModal = false;
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
    this.details = [];
    this.invoiceForm.reset();
    this.detailForm.reset(
      {
        category: '',
        tax: ''
      }
    );
    this.showEditInvoiceModal = false;
  }
}
