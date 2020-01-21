import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Course} from '../entities/course';

@Injectable({providedIn: 'root'})
export class CourseService {
  constructor(private http: HttpClient) {
  }

  public getCourses(): Observable<Array<Course>> {
    return this.http.get<Array<Course>>('/api/courses').pipe(map(courses => {
      courses.forEach(course => course.startDate = new Date(course.startDate));
      return courses;
    }));
  }
}
