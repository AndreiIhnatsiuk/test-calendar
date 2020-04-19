import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {Task} from '../entities/task';
import {FullTask} from '../entities/full-task';
import {map, switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TaskService {
  constructor(private http: HttpClient) {
  }

  public getTasksByTopicId(topicId: number): Observable<Array<Task>> {
    return this.http.get<Array<Task>>('/api/tasks?topicId=' + topicId);
  }

  public getTaskById(id: number): Observable<FullTask> {
    return this.http.get<FullTask>('/api/tasks/' + id);
  }
}
