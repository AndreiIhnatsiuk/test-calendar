import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {concat, Observable, Subject, timer} from 'rxjs';
import {SubmissionRequest} from '../entities/submission-request';
import {FullSubmission} from '../entities/full-submission';
import {StoredSolution} from '../entities/stored-solution';
import {LocalStorageService} from './local-storage.service';
import {filter, switchMap, tap} from 'rxjs/operators';
import {SubmissionStatus} from '../entities/submission-status';
import {UserAnswer} from '../entities/user-answer';
import {BestLastUserAnswer} from '../entities/best-last-user-answer';
import {BestLastFullSubmission} from '../entities/best-last-full-submission';
import {RunSubmission} from '../entities/run-submission';
import {RunSubmissionRequest} from '../entities/run-submission-request';

@Injectable({providedIn: 'root'})
export class SubmissionService {
  private runningTask: Set<number>;
  private runningRun: Set<number>;
  private changes: Subject<number>;

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService) {
    this.runningTask = new Set<number>();
    this.runningRun = new Set<number>();
    this.changes = new Subject<number>();
  }

  public getChanges(): Observable<number> {
    return this.changes;
  }

  public getTaskSubmissionsByProblemId(problemId: number): Observable<BestLastFullSubmission> {
    const params = new HttpParams().append('problemId', '' + problemId);
    const result = this.http.get<BestLastFullSubmission>('/api/task-submissions', {params});
    return concat(
      result,
      timer(2500, 2500).pipe(
        filter(() => this.runningTask.has(problemId)),
        switchMap(() => this.http.get<BestLastFullSubmission>('/api/task-submissions', {params}))
      )
    ).pipe(tap(submissions => {
      if (submissions.last !== null) {
        const isRunning = this.isTaskRunning(submissions.last);
        if (isRunning) {
          this.runningTask.add(problemId);
        } else if (this.runningTask.has(problemId)) {
          this.changes.next(problemId);
          this.runningTask.delete(problemId);
        }
      }
    }));
  }

  public getRunSubmissionsByProblemId(problemId: number): Observable<RunSubmission> {
    const params = new HttpParams().append('problemId', '' + problemId);
    const result = this.http.get<RunSubmission>('/api/run-submissions', {params});
    return concat(
      result,
      timer(2500, 2500).pipe(
        filter(() => this.runningRun.has(problemId)),
        switchMap(() => this.http.get<RunSubmission>('/api/run-submissions', {params}))
      )
    ).pipe(tap(submissions => {
      if (submissions !== null) {
        const isRunning = this.isRunRunning(submissions);
        if (isRunning) {
          this.runningRun.add(problemId);
        } else if (this.runningRun.has(problemId)) {
          this.changes.next(problemId);
          this.runningRun.delete(problemId);
        }
      }
    }));
  }

  public isTaskRunning(submission: FullSubmission): boolean {
    const status = SubmissionStatus[submission.status];
    return (status === SubmissionStatus.IN_QUEUE || status === SubmissionStatus.RUNNING);
  }

  public isRunRunning(submission: RunSubmission): boolean {
    const status = SubmissionStatus[submission.status];
    return (status === SubmissionStatus.IN_QUEUE || status === SubmissionStatus.RUNNING);
  }

  public postTaskSubmission(submissionRequest: SubmissionRequest): Observable<FullSubmission> {
    return this.http.post<FullSubmission>('/api/task-submissions', submissionRequest)
      .pipe(tap(() => this.runningTask.add(submissionRequest.problemId)));
  }

  public postRunSubmission(submissionRequest: RunSubmissionRequest): Observable<RunSubmission> {
    return this.http.post<RunSubmission>('/api/run-submissions', submissionRequest)
      .pipe(tap(() => this.runningRun.add(submissionRequest.problemId)));
  }

  public storeSolution(storedSolution: StoredSolution): void {
    this.localStorage.setItem('solution-' + storedSolution.problemId, JSON.stringify(storedSolution));
  }

  public getSolution(problemId: number): StoredSolution {
    const json = this.localStorage.getItem('solution-' + problemId);
    return json ? JSON.parse(json) as StoredSolution : null;
  }

  public sendAnswerUser(problemId: number, answer: number[]): Observable<UserAnswer> {
    return this.http.post<UserAnswer>('/api/question-submissions/', {problemId, answer})
      .pipe(tap(answers => {
        if (answers != null) {
          this.changes.next(problemId);
        }
      }));
  }

  public getAnswerUser(problemId: number): Observable<BestLastUserAnswer> {
    return this.http.get<BestLastUserAnswer>('/api/question-submissions?problemId=' + problemId);
  }
}
