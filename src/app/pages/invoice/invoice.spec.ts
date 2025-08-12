import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceComponent } from './invoice.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IManualInvoice } from '../../interfaces';
import { InvoiceService } from '../../services/invoice.service';

describe('InvoiceComponent', () => {
  let component: InvoiceComponent;
  let fixture: ComponentFixture<InvoiceComponent>;
  let invoiceService: jasmine.SpyObj<InvoiceService>;

  beforeEach(async () => {
    invoiceService = jasmine.createSpyObj('InvoiceService', ['getAll'], {
      search: { page: 1, size: 5 }
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: InvoiceService, useValue: invoiceService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceComponent);
    component = fixture.componentInstance;

  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer los valores en el formulario al llamar callEdition()', () => {
    const invoice: IManualInvoice = {
      id: 1,
      type: 'Ingreso',
      issueDate: '1/8/2025',
      consecutive: "1001",
      key: '23',
      receiver: {
          identification: '123456789',
          name: 'Luis',
          lastName: 'Nunez',
          email: 'luis@gmail.com'
        },
        details: []
    };
    component.callEdition(invoice);
    
    expect(component.invoiceForm.value).toEqual(jasmine.objectContaining({
      id: JSON.stringify(invoice.id),
      type: invoice.type,
      consecutive: invoice.consecutive?.toString(),
      key: invoice.key,
      issueDate: invoice.issueDate,
      identification: invoice.receiver?.identification,
      name: invoice.receiver?.name,
      lastName: invoice.receiver?.lastName,
      email: invoice.receiver?.email
    }));
   
  });

  it('debería cancelar la actualización de facturas', () => {
    spyOn(component.invoiceForm, 'reset');
    component.cancelUpdate();
    expect(component.invoiceForm.reset).toHaveBeenCalled();
    expect(component.showEditInvoiceModal).toBeFalse();
  });
});
