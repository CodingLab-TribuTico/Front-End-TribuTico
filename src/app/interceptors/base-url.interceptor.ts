import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const base: string = environment.apiUrl;

  // Remove leading slash from req.url to avoid double slashes
  const url = req.url.startsWith('/') ? req.url.substring(1) : req.url;

  const clonedRequest = req.clone({
    url: `${base}/${url}`,
    setHeaders: {
      Accept: 'application/json',
    },
  });

  return next(clonedRequest);
};
