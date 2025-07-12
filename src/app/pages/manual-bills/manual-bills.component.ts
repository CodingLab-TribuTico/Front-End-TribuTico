import { Component, inject, ViewChild } from '@angular/core';
import { BillsService } from '../../services/bills.service';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { IManualBill } from '../../interfaces';
import { ManualBillsFormComponent } from '../../components/manual-bills/manual-bills-form/manual-bills-form.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-manual-bills',
  templateUrl: './manual-bills.component.html',
  standalone: true,
  imports: [
    ManualBillsFormComponent,
    PaginationComponent,
    ModalComponent,
    ReactiveFormsModule
  ]
})
export class ManualBillsComponent {
   public electronicBillsService: BillsService = inject(BillsService);
   public fb: FormBuilder = inject(FormBuilder);
    public billsForm = this.fb.group({
      id: [''],
      consecutive: ['', Validators.required],
      code: ['', Validators.required],
      issueDate: ['', Validators.required],
      users: [''],
      details: ['']
    });
    public modalService: ModalService = inject(ModalService);
    
    public authService: AuthService = inject(AuthService);
  public areActionsAvailable: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
    });
  }

  constructor() {
    this.electronicBillsService.getAll();
  }

  saveBill(item: IManualBill) {
    this.electronicBillsService.save(item);
  }

  updateBill(item: IManualBill) {
    this.electronicBillsService.update(item);
    this.modalService.closeAll();
    this.billsForm.reset();
  }


  deleteBill(item: IManualBill) {
    this.electronicBillsService.delete(item);
  }

  
  }

