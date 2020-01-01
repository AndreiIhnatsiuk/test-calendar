import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authService.currentUserValue;
    if (!user) {
      return next.handle(req);
    }
    const headers = req.headers.set('Authorization', 'bearer ' + user.token);
    const newReq = req.clone({ headers: headers });
    return next.handle(newReq).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        this.authService.logout();
        return EMPTY;
      } else {
        return throwError(error);
      }
    }));
  }
}
