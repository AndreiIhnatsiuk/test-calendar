import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Submission} from '../entities/submission';
import {SubmissionRequest} from '../entities/submission-request';
import {map} from 'rxjs/operators';
import {SubmissionStatus} from '../entities/submission-status';
import {FullSubmission} from '../entities/full-submission';

@Injectable({providedIn: 'root'})
export class SubmissionService {
  constructor(private http: HttpClient) {
  }

  public getSubmissionsByTaskId(taskId: number): Observable<Array<Submission>> {
    return this.http.get<Array<Submission>>('/api/submissions?taskId=' + taskId);
  }

  public getSubmissionById(id: string): Observable<FullSubmission> {
    return this.http.get<FullSubmission>('/api/submissions/' + id);
  }

  public postSubmission(submissionRequest: SubmissionRequest): Observable<any> {
    return this.http.post('/api/submissions', submissionRequest);
  }
}
