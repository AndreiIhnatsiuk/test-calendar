import {EMPTY, Observable} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {concat} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SubmissionService} from './submission.service';

@Injectable({providedIn: 'root'})
export class AcceptedSubmissionService {
  constructor(private http: HttpClient,
              private submissionService: SubmissionService) {
  }

  public getProblemsStatuses(problemIds: Array<number>): Observable<Map<number, string>> {
    if (problemIds.length) {
      const url = '/api/problems-statuses?problemIds=' + problemIds.join(',');
      return concat(
        this.http.get<Map<number, string>>(url),
        this.submissionService.getChanges().pipe(
          filter(problemId => problemIds.indexOf(problemId) !== -1),
          switchMap(() => this.http.get<Map<number, string>>(url))
        )
      ).pipe(map(x => new Map<number, string>(Object.entries(x).map(y => [+y[0], y[1]]))));
    } else {
      return EMPTY;
    }
  }

  public getAcceptedByLessons(moduleId: number): Observable<Map<number, number>> {
    const url = '/api/accepted-problems?groupBy=lessons&moduleId=' + moduleId;
    return concat(
      this.http.get<Map<number, number>>(url),
      this.submissionService.getChanges().pipe(
        switchMap(() => this.http.get<Object>(url))
      )
    ).pipe(map(x => new Map<number, number>(Object.entries(x).map(y => [+y[0], y[1]]))));
  }
}
