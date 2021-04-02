import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {FuturePlan} from '../entities/future-plan';
import {ActivePlan} from '../entities/active-plan';
import {map, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PersonalPlanService {
  private changes: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.changes = new BehaviorSubject<boolean>(true);
  }

  public getChanges(): Observable<boolean> {
    return this.changes;
  }

  public generatePlan(): Observable<any> {
    return this.http.post('/api/plans', {})
      .pipe(tap(() => this.changes.next(true)));
  }

  public getActivePlan(): Observable<ActivePlan> {
    return this.http.get<ActivePlan>('/api/plans/active');
  }

  public getFuturePlan(): Observable<FuturePlan> {
    return this.http.get<FuturePlan>('/api/plans/future');
  }
}
