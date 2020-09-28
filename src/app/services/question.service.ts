import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Question} from '../entities/question';
import {FullQuestion} from '../entities/full-question';
import {UserAnswer} from '../entities/user-answer';
import {tap} from 'rxjs/operators';

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
        if (answer.right) {
          this.accepted.next(questionId);
        }
      }));
  }

  public getAnswerUser(questionId: number): Observable<UserAnswer> {
    return this.http.get<UserAnswer>('/api/answers?questionId=' + questionId);
  }
}
