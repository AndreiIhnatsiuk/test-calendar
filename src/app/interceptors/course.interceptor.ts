import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class CourseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const re = environment.auth.issuer;
    if (req.url.search(re) === -1) {
      const params = req.params.set('courseId', 1);
      const newReq = req.clone({params: params});
      return next.handle(newReq);
    }
    return next.handle(req);
  }
}
