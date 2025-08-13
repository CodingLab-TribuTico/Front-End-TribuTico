import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlertService } from './alert.service';
import { InvoiceService } from './invoice.service';
import { IManualInvoice } from '../interfaces';

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;
  let http: HttpTestingController;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InvoiceService,
        AlertService
      ]
    });

    invoiceService = TestBed.inject(InvoiceService);
    http = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(AlertService);
  });

  afterEach(() => {
    http.verify();
  });

  const testInvoice: IManualInvoice = {
    id: 1,
    type: 'Ingreso',
    consecutive: '00100001000',
    key: '50615',
    issueDate: '2025-08-12',
    details: [
      {
        cabys: '1234',
        quantity: 2,
        unit: 'Unidad',
        unitPrice: 5000,
        discount: 0,
        tax: 13,
        taxAmount: 1300,
        category: 'Servicios',
        total: 11300,
        description: 'Servicio de desarrollo web'
      }
    ],
    receiver: {
      name: 'Diego',
      lastName: 'Nunez',
      email: 'diego@gmail.com',
      identification: '101110111'
    }
  };

  const response = {
    data: [testInvoice],
    meta: {
      page: 1,
      size: 5
    }
  }

  it('debería devolver las facturas paginadas', () => {
    invoiceService.getAll();

    const req = http.expectOne(`invoices?page=1&size=5&search=`);
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(invoiceService.invoices$()).toEqual([testInvoice]);
  });

  it('debería crear una factura', () => {
    spyOn(alertService, 'showAlert');
    spyOn(invoiceService, 'getAll');
    invoiceService.save(testInvoice);

    const req = http.expectOne('invoices');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testInvoice);
    req.flush({
      data: testInvoice,
      message: 'Factura registrada exitosamente'
    });
    
    expect(invoiceService.getAll).toHaveBeenCalled();
    expect(alertService.showAlert).toHaveBeenCalledWith(
      'success',
      'Factura registrada exitosamente'
    );
  });
    
});