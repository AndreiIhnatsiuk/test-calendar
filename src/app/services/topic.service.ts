import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Topic} from '../entities/topic';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TopicService {
  constructor(private http: HttpClient) {
  }

  public getAllByModuleId(moduleId: number): Observable<Array<Topic>> {
    return this.http.get<Array<Topic>>('/api/topics?moduleId=' + moduleId);
  }

  public getById(id: number): Observable<Topic> {
    return this.http.get<Topic>('/api/topics/' + id);
  }
}
