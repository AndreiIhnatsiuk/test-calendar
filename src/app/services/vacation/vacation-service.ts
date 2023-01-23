import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Vacation} from '../../entities/vacation/vacation';
import {VacationDays} from '../../entities/vacation/vacation-days';
import {VacationRequest} from '../../entities/vacation/vacation-request';

@Injectable({providedIn: 'root'})
export class VacationService {
  constructor(private http: HttpClient) {
  }

  public getAllVacations(courseId: number): Observable<Array<Vacation>> {
    return this.http.get<Array<Vacation>>('api/vacations?courseId=' + courseId);
  }

  public getVacationsDays(courseId: number): Observable<VacationDays> {
    return this.http.get<VacationDays>('api/vacations-days?courseId=' + courseId);
  }

  public createVacation(courseId: number, vacationRequest: VacationRequest): Observable<any> {
    return this.http.post('api/vacations?courseId=' + courseId, vacationRequest);
  }

  public deleteVacation(id: number): Observable<any> {
    return this.http.delete('api/vacations/' + id);
  }

  public updateVacation(id: number, vacationRequestUpdate: VacationRequest): Observable<any> {
    return this.http.patch('api/vacations/' + id, vacationRequestUpdate);
  }
}
