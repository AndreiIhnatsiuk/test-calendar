import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {concat, Observable, Subject, timer} from 'rxjs';
import {Submission} from '../entities/submission';
import {SubmissionRequest} from '../entities/submission-request';
import {FullSubmission} from '../entities/full-submission';
import {StoredSolution} from '../entities/stored-solution';
import {LocalStorageService} from './local-storage.service';
import {filter, switchMap, tap} from 'rxjs/operators';
import {SubmissionStatus} from '../entities/submission-status';

@Injectable({providedIn: 'root'})
export class SubmissionService {
  private running: Set<number>;
  private changes: Subject<number>;

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService) {
    this.running = new Set<number>();
    this.changes = new Subject<number>();
  }

  public getChanges(): Observable<number> {
    return this.changes;
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
    const result = this.http.get<Array<Submission>>('/api/submissions', {params: params});
    return concat(
      result,
      timer(2500, 2500).pipe(
        filter(() => this.running.has(taskId)),
        switchMap(() => this.http.get<Array<Submission>>('/api/submissions', {params: params}))
      )
    ).pipe(tap(submissions => {
      const isRunning = submissions.findIndex(submission => this.isRunning(submission)) !== -1;
      if (isRunning) {
        this.running.add(taskId);
      } else if (this.running.has(taskId)) {
        this.changes.next(taskId);
        this.running.delete(taskId);
      }
    }));
  }

  public isRunning(submission: Submission): boolean {
    const status = SubmissionStatus[submission.status];
    return (status === SubmissionStatus.IN_QUEUE || status === SubmissionStatus.RUNNING);
  }

  public getSubmissionById(id: string): Observable<FullSubmission> {
    return this.http.get<FullSubmission>('/api/submissions/' + id);
  }

  public postSubmission(submissionRequest: SubmissionRequest): Observable<Submission> {
    return this.http.post<Submission>('/api/submissions', submissionRequest)
      .pipe(tap(() => this.running.add(submissionRequest.taskId)));
  }

  public storeSolution(storedSolution: StoredSolution): void {
    this.localStorage.setItem('solution-' + storedSolution.taskId, JSON.stringify(storedSolution));
  }

  public getSolution(taskId: number): StoredSolution {
    const json = this.localStorage.getItem('solution-' + taskId);
    return json ? JSON.parse(json) as StoredSolution : null;
  }
}
