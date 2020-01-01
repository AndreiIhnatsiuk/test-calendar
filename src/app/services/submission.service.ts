import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Submission} from '../entities/submission';

@Injectable({providedIn: 'root'})
export class SubmissionService {
  constructor(private http: HttpClient) {
  }

  public getSubmissionsByTaskId(taskId: number): Observable<Array<Submission>> {
    return this.http.get<Array<Submission>>('/api/submissions?taskId=' + taskId);
  }
}
