import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FullLesson} from '../entities/full-lesson';

@Injectable({providedIn: 'root'})
export class LessonService {
  constructor(private http: HttpClient) {
  }

  public getLessonById(id: number): Observable<FullLesson> {
    return this.http.get<FullLesson>('/api/lessons/' + id);
  }
}
