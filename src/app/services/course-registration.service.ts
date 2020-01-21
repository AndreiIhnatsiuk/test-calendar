import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CourseRegistration} from '../entities/course-registration';

@Injectable({providedIn: 'root'})
export class CourseRegistrationService {
  constructor(private http: HttpClient) {
  }

  public registration(courseId: number): Observable<any> {
    return this.http.post<any>('/api/course-registrations', {courseId: courseId});
  }

  public getByCourseId(courseId: number): Observable<CourseRegistration> {
    return this.http.get<CourseRegistration>('/api/course-registrations?courseId=' + courseId);
  }
}
