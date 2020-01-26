import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Intro} from '../entities/intro';

@Injectable({providedIn: 'root'})
export class IntroService {
  constructor(private http: HttpClient) {
  }

  public getIntroByRegistrationId(registrationId: number): Observable<Array<Intro>> {
    return this.http.get<Array<Intro>>('/api/course-intros?registrationId=' + registrationId).pipe(map(intros => {
      intros.forEach(intro => {
        intro.start = new Date(intro.start);
        intro.end = new Date(intro.end);
      });
      return intros;
    }));
  }

  public start(registrationId: number): Observable<any> {
    return this.http.post<any>('/api/course-intros', {courseRegistrationId: registrationId});
  }
}
