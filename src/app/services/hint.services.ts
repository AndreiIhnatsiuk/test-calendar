import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Hint} from '../entities/hint';

@Injectable({providedIn: 'root'})
export class HintService {
  constructor(private http: HttpClient) {
  }

  public getAllOpenedHints(taskId: number): Observable<Array<Hint>> {
    return this.http.get<Array<Hint>>('/api/used-hints?taskId=' + taskId);
  }

  public postNextHintByTaskId(taskId: number): Observable<Hint> {
    return this.http.post<Hint>('/api/used-hints/', {taskId: taskId});
  }
}
