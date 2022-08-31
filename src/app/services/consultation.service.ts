import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Consultation} from '../entities/consultation';

@Injectable({providedIn: 'root'})
export class ConsultationService {
  constructor(private http: HttpClient) {
  }

  public getConsultation(): Observable<Consultation> {
    return this.http.get<Consultation>('/api/schedules/me');
  }

}
