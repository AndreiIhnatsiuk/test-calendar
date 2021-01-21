import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {merge, Observable} from 'rxjs';
import {SubmissionService} from './submission.service';
import {map, switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AvailableProblemsService {
  constructor(private http: HttpClient,
              private submissionService: SubmissionService) {
  }

  private getAvailableProblemsSingle(lessonId: number): Observable<Set<number>> {
    return this.http.get<Array<number>>('/api/available-problems?lessonId=' + lessonId)
      .pipe(map(problemIds => new Set(problemIds)));
  }

  public getAvailableProblems(lessonId: number): Observable<Set<number>> {
    return merge(
      this.getAvailableProblemsSingle(lessonId),
      this.submissionService.getChanges().pipe(switchMap(() => this.getAvailableProblemsSingle(lessonId)))
    );
  }
}
