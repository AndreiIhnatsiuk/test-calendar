import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {concat, EMPTY, Observable, Subject, timer} from 'rxjs';
import {SubmissionRequest} from '../entities/submission-request';
import {FullSubmission} from '../entities/full-submission';
import {StoredSolution} from '../entities/stored-solution';
import {LocalStorageService} from './local-storage.service';
import {catchError, filter, switchMap, tap} from 'rxjs/operators';
import {SubmissionStatus} from '../entities/submission-status';
import {UserAnswer} from '../entities/user-answer';
import {BestLastUserAnswer} from '../entities/best-last-user-answer';
import {BestLastFullSubmission} from '../entities/best-last-full-submission';
import {RunSubmission} from '../entities/run-submission';
import {RunSubmissionRequest} from '../entities/run-submission-request';
import {GitTaskSubmissionRequest} from '../entities/git-task-submission-request';

@Injectable({providedIn: 'root'})
export class SubmissionService {
  private runningTask: Set<number>;
  private runningRun: Set<number>;
  private readonly changes: Subject<number>;

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService) {
    this.runningTask = new Set<number>();
    this.runningRun = new Set<number>();
    this.changes = new Subject<number>();
  }

  public getChanges(): Observable<number> {
    return this.changes;
  }

  public getGitTaskSubmissionsByProblemId(problemId: number): Observable<BestLastFullSubmission> {
    return this.getSubmissionByProblemIdAndUrlApi(problemId, '/api/git-task-submissions');
  }

  public getGitManualTaskSubmissionsByProblemId(problemId: number): Observable<BestLastFullSubmission> {
    return this.getSubmissionByProblemIdAndUrlApi(problemId, '/api/git-manual-task-submissions');
  }

  public getTaskSubmissionsByProblemId(problemId: number): Observable<BestLastFullSubmission> {
    return this.getSubmissionByProblemIdAndUrlApi(problemId, '/api/task-submissions');
  }

  private getSubmissionByProblemIdAndUrlApi(problemId: number, url: string): Observable<BestLastFullSubmission> {
    const params = new HttpParams().append('problemId', '' + problemId);
    const result = this.http.get<BestLastFullSubmission>(url, {params});
    return concat(
      result,
      timer(2500, 2500).pipe(
        filter(() => this.runningTask.has(problemId)),
        switchMap(() => this.http.get<BestLastFullSubmission>(url, {params}))
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

  public getRunSubmissionsByProblemIdOnce(problemId: number): Observable<RunSubmission> {
    const params = new HttpParams().append('problemId', '' + problemId);
    return this.http.get<RunSubmission>('/api/run-submissions', {params}).pipe(
      catchError(error => {
        if (error.status === 404) {
          return EMPTY;
        } else {
          throw error;
        }
      }));
  }

  public getRunSubmissionsByProblemId(problemId: number): Observable<RunSubmission> {
    return concat(
      this.getRunSubmissionsByProblemIdOnce(problemId),
      timer(2500, 2500).pipe(
        filter(() => this.runningRun.has(problemId)),
        switchMap(() => this.getRunSubmissionsByProblemIdOnce(problemId))
      )
    ).pipe(tap(submissions => {
      if (submissions !== null) {
        const isRunning = this.isRunRunning(submissions);
        if (isRunning) {
          this.runningRun.add(problemId);
        } else if (this.runningRun.has(problemId)) {
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

  public postGitTaskSubmission(submissionRequest: GitTaskSubmissionRequest): Observable<FullSubmission> {
    return this.http.post<FullSubmission>('/api/git-task-submissions', submissionRequest)
      .pipe(tap(() => this.runningTask.add(submissionRequest.problemId)));
  }

  public postGitTaskManualSubmission(submissionRequest: GitTaskSubmissionRequest): Observable<FullSubmission> {
    return this.http.post<FullSubmission>('/api/git-manual-task-submissions', submissionRequest)
      .pipe(tap(() => this.runningTask.add(submissionRequest.problemId)));
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
