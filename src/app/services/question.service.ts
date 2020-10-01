import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {concat, Observable, Subject} from 'rxjs';
import {Question} from '../entities/question';
import {FullQuestion} from '../entities/full-question';
import {UserAnswer} from '../entities/user-answer';
import {map, switchMap, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class QuestionService {
  private accepted: Subject<number>;

  constructor(private http: HttpClient) {
    this.accepted = new Subject<number>();
  }

  getAccepted(): Observable<number> {
    return this.accepted;
  }

  public getQuestionsBySubtopicId(subtopicId: number): Observable<Array<Question>> {
    return this.http.get<Array<Question>>('/api/questions?subtopicId=' + subtopicId);
  }

  public getQuestionById(id: number): Observable<FullQuestion> {
    return this.http.get<FullQuestion>('/api/questions/' + id);
  }

  public sendAnswerUser(questionId: number, answers: number[]): Observable<UserAnswer> {
    return this.http.post<UserAnswer>('/api/answers/', {questionId: questionId, answer: answers})
      .pipe(tap(answer => {
        if (answer != null) {
          this.accepted.next(questionId);
        }
      }));
  }

  public getAnswerUser(questionId: number): Observable<UserAnswer> {
    return this.http.get<UserAnswer>('/api/answers?questionId=' + questionId);
  }

  public getAcceptedByQuestionIds(questionIds: Array<number>): Observable<Map<number, boolean>> {
    const url = '/api/accepted-questions?questionIds=' + questionIds.join(',');
    return concat(
      this.http.get<Map<number, Boolean>>(url),
      this.getAccepted().pipe(
        switchMap(() => this.http.get<Map<number, boolean>>(url))
      )
    ).pipe(map(x => new Map<number, boolean>(Object.entries(x).map(y => [+y[0], y[1]]))));
  }

  public countBySubtopic(): Observable<Map<number, number>> {
    return this.http.get('/api/questions?groupBy=subtopics')
      .pipe(map(x => new Map<number, number>(Object.entries(x).map(y => [+y[0], y[1]]))));
  }

  public getAcceptedBySubtopics(): Observable<Map<number, number>> {
    const url = '/api/accepted-questions?groupBy=subtopics';
    return concat(
      this.http.get<Map<number, number>>(url),
      this.getAccepted().pipe(
        switchMap(() => this.http.get<Map<number, number>>(url))
      )
    ).pipe(map(x => new Map<number, number>(Object.entries(x).map(y => [+y[0], y[1]]))));
  }
}
