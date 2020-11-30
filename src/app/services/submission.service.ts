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
import {UserAnswer} from '../entities/user-answer';
import {BestLastUserAnswer} from '../entities/best-last-user-answer';
import {BestLastFullSubmission} from '../entities/best-last-full-submission';

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

  public getSubmissionsByProblemId(problemId: number): Observable<BestLastFullSubmission> {
    const params = new HttpParams().append('problemId', '' + problemId);
    const result = this.http.get<BestLastFullSubmission>('/api/task-submissions', {params});
    return concat(
      result,
      timer(2500, 2500).pipe(
        filter(() => this.running.has(problemId)),
        switchMap(() => this.http.get<BestLastFullSubmission>('/api/task-submissions', {params}))
      )
    ).pipe(tap(submissions => {
      if (submissions.last !== null) {
        const isRunning = this.isRunning(submissions.last);
        if (isRunning) {
          this.running.add(problemId);
        } else if (this.running.has(problemId)) {
          this.changes.next(problemId);
          this.running.delete(problemId);
        }
      }
    }));
  }

  public isRunning(submission: FullSubmission): boolean {
    const status = SubmissionStatus[submission.status];
    return (status === SubmissionStatus.IN_QUEUE || status === SubmissionStatus.RUNNING);
  }

  public postSubmission(submissionRequest: SubmissionRequest): Observable<Submission> {
    return this.http.post<Submission>('/api/task-submissions', submissionRequest)
      .pipe(tap(() => this.running.add(submissionRequest.problemId)));
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
