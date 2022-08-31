import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserRating} from '../entities/user-rating';

@Injectable({providedIn: 'root'})
export class UserRatingService {
  constructor(private http: HttpClient) {
  }

  public getRankByTime(problemId: number): Observable<UserRating> {
    return this.http.get<UserRating>('/api/rating/time?problemId=' + problemId);
  }

  public getRankByTries(problemId: number): Observable<UserRating> {
    return this.http.get<UserRating>('/api/rating/tries?problemId=' + problemId);
  }

}
