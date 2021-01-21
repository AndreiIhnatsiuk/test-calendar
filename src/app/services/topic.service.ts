import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Topic} from '../entities/topic';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TopicService {
  constructor(private http: HttpClient) {
  }

  public getTopics(): Observable<Array<Topic>> {
    return this.http.get<Array<Topic>>('/api/topics');
  }
}
