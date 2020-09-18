import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AvailableTopicsService {
  constructor(private http: HttpClient) {
  }

  public getAvailableTopics(): Observable<Set<number>> {
    return this.http.get<Set<number>>('/api/available-topics');
  }
}
