import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from '../entities/task';
import {FullTask} from '../entities/full-task';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TaskService {
  constructor(private http: HttpClient) {
  }

  public getTasksBySubtopicId(subtopicId: number): Observable<Array<Task>> {
    return this.http.get<Array<Task>>('/api/tasks?subtopicId=' + subtopicId);
  }

  public getTaskById(id: number): Observable<FullTask> {
    return this.http.get<FullTask>('/api/tasks/' + id);
  }

  public countBySubtopic(): Observable<Map<number, number>> {
    return this.http.get('/api/tasks?groupBy=subtopics')
      .pipe(map(x => new Map<number, number>(Object.entries(x).map(y => [+y[0], y[1]]))));
  }
}
