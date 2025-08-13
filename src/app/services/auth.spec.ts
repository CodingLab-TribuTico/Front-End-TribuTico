import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import {TestBed} from '@angular/core/testing';
import { AuthService } from "./auth.service";
import { IRoleType, IUser } from "../interfaces";

describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpTestingController;
 
  const testUser: IUser = {
    email: 'luis@gmail.com',
    authorities: [{authority: IRoleType.user}]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });

    authService = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();  
    localStorage.clear();
  });

  it('debería crear el servicio', () => {
    expect(authService).toBeTruthy();
  });
  
  it('debería verificar si el usuario tiene un rol específico', () => {
    localStorage.setItem('auth_user', JSON.stringify(testUser));
    authService['load']();

    expect(authService.hasRole(IRoleType.user)).toBeTrue();
    expect(authService.hasRole(IRoleType.superAdmin)).toBeFalse();
  });

  it('debería cerrar la sesión y limpiar los datos del localStorage', () => {
    localStorage.setItem('access_token', 'test');
    localStorage.setItem('auth_user', JSON.stringify(testUser));

    authService.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(localStorage.getItem('expiresIn')).toBeNull();
  });

  
  it('debería retornar true cuando existe token', () => {
    localStorage.setItem('access_token', JSON.stringify('test-token'));
    authService['load']();

    expect(authService.check()).toBe(true);
  });

  it('debería retornar false cuando un token no existe', () => {
    localStorage.clear();

    expect(authService.check()).toBe(false);
  });
  
});
