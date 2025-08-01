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
  private alertService: AlertService = inject(AlertService);
  private userListSignal = signal<IUser[]>([]);
  get users$() {

    return this.userListSignal;
  }
  public search: ISearch = {
    page: 1,
    size: 5,
    search: "",
  }
  public totalItems: number[] = [];

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size, search: this.search.search }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.userListSignal.set(response.data);
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al recuperar los usuarios');
      }
    });
  }


  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.alertService.showAlert('success', response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al agregar el usuario');
      }
    });
  }

  update(user: IUser) {
    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        this.alertService.showAlert('success', response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al actualizar el usuario');
      }
    });
  }

  delete(user: IUser) {
    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        this.alertService.showAlert('success', response.message);
        this.getAll();
      },
      error: () => {
        this.alertService.showAlert('error', 'Ocurrió un error al eliminar el usuario');
      }
    });
  }

  updatePatch(user: IUser): Observable<any> {
    return this.patchCustomSource(`${user.id}`, user).pipe(
      tap((response: any) => {
        this.alertService.showAlert('success', response.message);
        this.getAll();
      }),
      catchError((err: any) => {
        this.alertService.showAlert('error', 'Ocurrió un error al actualizar el usuario');
        return throwError(() => err);
      })
    );
  }
}