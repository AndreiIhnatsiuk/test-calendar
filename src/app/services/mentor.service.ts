import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Mentor} from '../entities/mentor';

@Injectable({providedIn: 'root'})
export class MentorService {
  constructor(private http: HttpClient) {
  }

  public get(courseId: number): Observable<Array<Mentor>> {
    return this.http.get<Array<Mentor>>('/api/mentors?courseId=' + courseId);
  }

}
