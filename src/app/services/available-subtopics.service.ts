import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {concat, merge, Observable} from 'rxjs';
import {SubmissionService} from './submission.service';
import {map, switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AvailableSubtopicsService {
  constructor(private http: HttpClient,
              private submissionService: SubmissionService) {
  }

  private getAvailableSubtopicsSingle(): Observable<Set<number>> {
    return this.http.get<Array<number>>('/api/available-subtopics')
      .pipe(map(subtopics => new Set(subtopics)));
  }

  public getAvailableSubtopics(): Observable<Set<number>> {
    return merge(
      this.getAvailableSubtopicsSingle(),
      this.submissionService.getChanges().pipe(switchMap(() => this.getAvailableSubtopicsSingle()))
    );
  }
}
