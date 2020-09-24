import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chapter} from '../entities/chapter';
import {Observable} from 'rxjs';
import {FullSubtopic} from '../entities/full-subtopic';

@Injectable({providedIn: 'root'})
export class SubtopicService {
  constructor(private http: HttpClient) {
  }

  public getSubtopicById(id: number): Observable<FullSubtopic> {
    return this.http.get<FullSubtopic>('/api/subtopics/' + id);
  }

  public getChapters(): Observable<Array<Chapter>> {
    return this.http.get<Array<Chapter>>('/api/chapters');
  }
}
