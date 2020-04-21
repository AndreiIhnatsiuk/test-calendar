import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Submission} from '../entities/submission';
import {SubmissionRequest} from '../entities/submission-request';
import {FullSubmission} from '../entities/full-submission';
import {StoredSolution} from '../entities/stored-solution';
import {LocalStorageService} from './local-storage.service';

@Injectable({providedIn: 'root'})
export class SubmissionService {
  constructor(private http: HttpClient,
              private localStorage: LocalStorageService) {
  }

  public getSubmissionsByTaskId(taskId: number, start: Date, end: Date): Observable<Array<Submission>> {
    let params = new HttpParams()
      .append('taskId', '' + taskId);
    if (start) {
      params = params.append('start', start.toISOString());
    }
    if (end) {
      params = params.append('end', end.toISOString());
    }
    return this.http.get<Array<Submission>>('/api/submissions', {params: params});
  }

  public getSubmissionById(id: string): Observable<FullSubmission> {
    return this.http.get<FullSubmission>('/api/submissions/' + id);
  }

  public postSubmission(submissionRequest: SubmissionRequest): Observable<any> {
    return this.http.post('/api/submissions', submissionRequest);
  }

  public storeSolution(storedSolution: StoredSolution): void {
    localStorage.setItem('solution-' + storedSolution.taskId, JSON.stringify(storedSolution));
  }

  public getSolution(taskId: number): StoredSolution {
    const json = localStorage.getItem('solution-' + taskId);
    return json ? JSON.parse(json) as StoredSolution : null;
  }
}
