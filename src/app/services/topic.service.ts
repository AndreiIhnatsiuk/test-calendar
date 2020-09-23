import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Topic} from '../entities/topic';
import {Observable} from 'rxjs';
import {FullTopic} from '../entities/full-topic';

@Injectable({providedIn: 'root'})
export class TopicService {
  constructor(private http: HttpClient) {
  }

  public getTopicById(id: number): Observable<FullTopic> {
    return this.http.get<FullTopic>('/api/topics/' + id);
  }

  public getTopics(): Observable<Array<Topic>> {
    return this.http.get<Array<Topic>>('/api/chapters');
  }
}
