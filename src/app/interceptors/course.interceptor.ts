import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class CourseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const params = req.params.set('courseId', 1);
    const newReq = req.clone({ params: params });
    return next.handle(newReq);
  }
}
