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

  private getAvailableProblemsSingleByLessonId(lessonId: number): Observable<Set<number>> {
    return this.http.get<Array<number>>('/api/available-problems?lessonId=' + lessonId)
      .pipe(map(problemIds => new Set(problemIds)));
  }

  public getAvailableProblemsByLessonId(lessonId: number): Observable<Set<number>> {
    return merge(
      this.getAvailableProblemsSingleByLessonId(lessonId),
      this.submissionService.getChanges().pipe(switchMap(() => this.getAvailableProblemsSingleByLessonId(lessonId)))
    );
  }

  private getAvailableProblemsSingleByProblemIdIn(problemIds: Array<number>): Observable<Set<number>> {
    return this.http.get<Array<number>>('/api/available-problems?problemIds=' + problemIds)
      .pipe(map(availableProblemIds => new Set(availableProblemIds)));
  }

  public getAvailableProblemsByProblemIdIn(problemIds: Array<number>): Observable<Set<number>> {
    return merge(
      this.getAvailableProblemsSingleByProblemIdIn(problemIds),
      this.submissionService.getChanges().pipe(switchMap(() => this.getAvailableProblemsSingleByProblemIdIn(problemIds)))
    );
  }
}
