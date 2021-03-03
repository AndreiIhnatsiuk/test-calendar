import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FullLesson} from '../entities/full-lesson';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LessonService {
  constructor(private http: HttpClient) {
  }

  public getLessonById(id: number): Observable<FullLesson> {
    return this.http.get<FullLesson>('/api/lessons/' + id);
  }

  public countByModules(): Observable<Map<number, number>> {
    return this.http.get('/api/lessons?groupBy=modules')
      .pipe(map(x => new Map<number, number>(Object.entries(x).map(y => [+y[0], y[1]]))));
  }
}
