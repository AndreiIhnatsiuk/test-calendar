import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {merge, Observable} from 'rxjs';
import {SubmissionService} from './submission.service';
import {map, switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AvailableLessonsService {
  constructor(private http: HttpClient,
              private submissionService: SubmissionService) {
  }

  private getAvailableLessonsSingle(): Observable<Set<number>> {
    return this.http.get<Array<number>>('/api/available-lessons')
      .pipe(map(lessons => new Set(lessons)));
  }

  public getAvailableLessons(): Observable<Set<number>> {
    return merge(
      this.getAvailableLessonsSingle(),
      this.submissionService.getChanges().pipe(switchMap(() => this.getAvailableLessonsSingle()))
    );
  }
}
