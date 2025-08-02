import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AlertService } from './alert.service';

describe('UserService', () => {
  let userService: UserService;
  let http: HttpTestingController;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        AlertService
      ]
    });

    userService = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(AlertService);
  });

  afterEach(() => {
    http.verify();
  });

  const testUser = {
    id: 1,
    identification: '101110111',
    name: 'luis',
    lastname: 'Nunez',
    lastname2: 'Brenes',
    birthDate: '2000-05-14',
    email: 'luis@gmail.com',
    password: '123'
  };

  const response = {
    data: [testUser],
    meta: {
      page: 1,
      size: 5
    }
  }

  it('debería devolver todos los usuarios', () => {
    userService.getAll();

    const req = http.expectOne(`users?page=1&size=5&search=`);
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(userService.users$()).toEqual([testUser]);
  });

  it('debería crear un usuario', () => {
    spyOn(alertService, 'showAlert');
    spyOn(userService, 'getAll');
    userService.save(testUser);

    const req = http.expectOne('users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testUser);
    req.flush({
      data: testUser,
      message: 'El usuario fue correctamente registrado'
    });

    expect(userService.getAll).toHaveBeenCalled();
    expect(alertService.showAlert).toHaveBeenCalledWith(
      'success',
      'El usuario fue correctamente registrado'
    );
  });

  it('debería actualizar los datos de un usuario', () => {
    spyOn(alertService, 'showAlert');
    spyOn(userService, 'getAll');
    userService.updatePatch(testUser).subscribe();
    
    const req = http.expectOne(`users/${testUser.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(testUser);
    req.flush({ 
      data: testUser,
      message: 'Usuario modificado exitosamente'
    });  

    expect(userService.getAll).toHaveBeenCalled();
    expect(alertService.showAlert).toHaveBeenCalledWith(
      'success',
      'Usuario modificado exitosamente'
    );
  });
      
  it('debería eliminar un usuario', () => {
    spyOn(alertService, 'showAlert');
    spyOn(userService, 'getAll');
    userService.delete(testUser);

    const req = http.expectOne(`users/${testUser.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ 
      message: 'Usuario eliminado con éxito' 
    });

    expect(userService.getAll).toHaveBeenCalled();
    expect(alertService.showAlert).toHaveBeenCalledWith(
      'success',
      'Usuario eliminado con éxito'
    );
  });

});
 


