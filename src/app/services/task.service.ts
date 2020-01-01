import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {Task} from '../entities/task';
import {FullTask} from '../entities/full-task';
import {map} from 'rxjs/operators';

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

  public getAccepted(tasks: Array<Task>): Observable<Set<number>> {
    if (tasks.length) {
      const ids = tasks.map(task => task.id).join(',');
      return this.http.get<Array<number>>('/api/accepted-tasks?taskIds=' + ids).pipe(map(array => new Set(array)));
    } else {
      return EMPTY;
    }
  }
}
