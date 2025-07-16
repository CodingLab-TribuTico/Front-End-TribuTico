import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IUser } from '../interfaces';
import { AlertService } from './alert.service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';
  private userListSignal = signal<IUser[]>([]);
  get users$() {

    return this.userListSignal;
  }
  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  }
  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size, search: this.search.search }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.userListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }


  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al agregar el usuario', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(user: IUser) {
    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', err.message, 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(user: IUser) {
    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error eliminando al usuario', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  updatePatch(user: IUser): Observable<any> {
    return this.patchCustomSource(`${user.id}`, user).pipe(
      tap((response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      }),
      catchError((err: any) => {
        this.alertService.displayAlert('error', err.message, 'center', 'top', ['error-snackbar']);
        console.error('error', err);
        return throwError(() => err);
      })
    );
  }
}