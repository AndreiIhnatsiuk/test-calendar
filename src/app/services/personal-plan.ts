import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FuturePlan} from '../entities/future-plan';
import {ActivePlan} from '../entities/active-plan';

@Injectable({providedIn: 'root'})
export class PersonalPlanService {
  constructor(private http: HttpClient) {
  }

  public generatePlan(): Observable<any> {
    return this.http.post('/api/plans', {});
  }

  public getActivePlan(): Observable<ActivePlan> {
    return this.http.get<ActivePlan>('/api/plans/active');
  }

  public getFuturePlan(): Observable<FuturePlan> {
    return this.http.get<FuturePlan>('/api/plans/future');
  }
}
