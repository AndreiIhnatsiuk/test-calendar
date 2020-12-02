import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Hint} from '../entities/hint';

@Injectable({providedIn: 'root'})
export class HintService {
  constructor(private http: HttpClient) {
  }

  public getAllOpenedHints(problemId: number): Observable<Array<Hint>> {
    return this.http.get<Array<Hint>>('/api/used-hints?problemId=' + problemId);
  }

  public postNextHintByTaskId(problemId: number): Observable<Hint> {
    return this.http.post<Hint>('/api/used-hints/', {problemId});
  }
}
