import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const handleErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return next(req).pipe(
    catchError((error: any): Observable<any> => {
      if ((error.status === 401 || error.status === 403) && !req.url.includes('auth')) {
        authService.logout();
        authService.tokenIsExpired = true;

        router.navigateByUrl('/login');
        return of({ status: false });
      }

      return throwError(() => error.error);
    })
  );
};
