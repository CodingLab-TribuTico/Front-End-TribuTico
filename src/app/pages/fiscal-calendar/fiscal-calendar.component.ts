import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { IFiscal } from '../../interfaces';
import { ModalService } from '../../services/modal.service';
import { FiscalCalendarListComponent } from '../../components/fiscal-calendar-list/fiscal-calendar-list.component';
import { FiscalCalendarService } from '../../services/fiscal-calendar.service';
import { FiscalCalendarFormComponent } from "../../components/fiscal-calendar-form/fiscal-calendar-form.component";

@Component({
  selector: 'app-fiscal-calendar',
  standalone: true,
  imports: [FiscalCalendarListComponent,
    PaginationComponent,
    LoaderComponent,
    ModalComponent,
    FiscalCalendarFormComponent],
  templateUrl: './fiscal-calendar.component.html',
})
export class FiscalCalendarComponent {
  public fiscalCalendarService = inject(FiscalCalendarService);
  public title: string = 'Calendario Fiscal';
  public isEditing: boolean = false;
  @Output() callCustomSearchMethod = new EventEmitter();
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addFiscalCalendarModal') public addFiscalCalendarModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  fiscalForm = this.fb.group({
    id: [null as number | null],
    name: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required,],
    type: ['', Validators.required]
  })

  constructor() {
    this.fiscalCalendarService.search.page = 1;
    this.fiscalCalendarService.getAll();
  }

  saveFiscalNotification(formValue: any) {
    const fiscalCalendar: IFiscal = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
      taxDeclarationDeadline: formValue.taxDeclarationDeadline,
      type: formValue.type
    };

    if (this.isEditing && fiscalCalendar.id) {
      this.fiscalCalendarService.updateFiscalCalendar(fiscalCalendar);
      this.hideModal();
      this.resetForm();
      this.isEditing = false;
    } else {
      this.fiscalCalendarService.saveFiscalCalendar(fiscalCalendar);
      this.hideModal();
      this.resetForm();

    }
  }

  editFiscalCalendar(fiscalCalendar: IFiscal) {
    this.fiscalForm.patchValue({
      id: fiscalCalendar.id,
      name: fiscalCalendar.name,
      description: fiscalCalendar.description,
      date: fiscalCalendar.taxDeclarationDeadline,
      type: fiscalCalendar.type
    });
    this.isEditing = true;
    this.openModal();
  }

  openModal() {
    this.modalService.displayModal(this.addFiscalCalendarModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }

  search(event: Event) {
    let input = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.fiscalCalendarService.search.page = 1;
    this.fiscalCalendarService.search.search = input;
    this.fiscalCalendarService.getAll();
  }

  cancelForm() {
    this.hideModal();
    this.resetForm();
    this.isEditing = false;
  }

  resetForm() {
    this.fiscalForm.reset({
      name: '',
      description: '',
      date: '',
      type: ''
    });
  }
}
