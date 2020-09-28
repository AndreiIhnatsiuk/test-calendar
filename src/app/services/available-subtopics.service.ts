import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {concat, Observable} from 'rxjs';
import {SubmissionService} from './submission.service';
import {QuestionService} from './question.service';
import {map, switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AvailableSubtopicsService {
  constructor(private http: HttpClient,
              private submissionService: SubmissionService,
              private questionService: QuestionService) {
  }

  private getAvailableTopicsSingle(): Observable<Set<number>> {
    return this.http.get<Array<number>>('/api/available-subtopics')
      .pipe(map(topics => new Set(topics)));
  }

  public getAvailableTopics(): Observable<Set<number>> {
    return concat(
      this.getAvailableTopicsSingle(),
      this.submissionService.getChanges().pipe(switchMap(() => this.getAvailableTopicsSingle())),
      this.questionService.getAccepted().pipe(switchMap(() => this.getAvailableTopicsSingle()))
    );
  }
}
