import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {concat, EMPTY, Observable} from 'rxjs';
import {Question} from '../entities/question';
import {FullQuestion} from '../entities/full-question';
import {Right} from '../entities/right';
import {filter, map, switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class QuestionService {
  constructor(private http: HttpClient) {
  }

  public getQuestionsByTopicId(topicId: number): Observable<Array<Question>> {
    return this.http.get<Array<Question>>('/api/questions?topicId=' + topicId);
  }

  public getQuestionById(id: number): Observable<FullQuestion> {
    return this.http.get<FullQuestion>('/api/questions/' + id);
  }

  public sendAnswerUser(id: number, answers: number[]): Observable<Right> {
    return this.http.post<Right>('/api/questions/' + id, {answer: answers});
  }

  public getAnswerUser(id: number): Observable<Right> {
    return this.http.get<Right>('/api/questions/answers?questionId=' + id);
  }
}
