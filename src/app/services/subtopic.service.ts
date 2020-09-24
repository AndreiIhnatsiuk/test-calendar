import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Topic} from '../entities/topic';
import {Observable} from 'rxjs';
import {FullSubtopic} from '../entities/full-subtopic';

@Injectable({providedIn: 'root'})
export class SubtopicService {
  constructor(private http: HttpClient) {
  }

  public getSubtopicById(id: number): Observable<FullSubtopic> {
    return this.http.get<FullSubtopic>('/api/subtopics/' + id);
  }

  public getTopics(): Observable<Array<Topic>> {
    return this.http.get<Array<Topic>>('/api/topics');
  }
}
