import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Appointment} from '../../entities/calendar/appointment';
import {AppointmentType} from '../../entities/calendar/appointment-type';
import {AppointmentRequest} from '../../entities/calendar/appointment-request';
import {AppointmentUpdate} from '../../entities/calendar/appointment-update';
import {AppointmentTime} from '../../entities/calendar/appointment-time';

@Injectable({providedIn: 'root'})
export class AppointmentService {
  constructor(private http: HttpClient) {
  }

  public getAppointments(): Observable<Array<Appointment>> {
    return this.http.get<Array<Appointment>>('/api/appointments');
  }

  public addAppointment(appointmentRequest: AppointmentRequest): Observable<any> {
    return this.http.post('/api/appointments', appointmentRequest);
  }

  public getAppointmentTypes(): Observable<Array<AppointmentType>> {
    return this.http.get<Array<AppointmentType>>('/api/appointment-types');
  }

  public deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete('/api/appointments/' + appointmentId);
  }

  public patchAppointment(appointmentId: number, update: AppointmentUpdate): Observable<AppointmentUpdate> {
    return this.http.patch<AppointmentUpdate>('/api/appointments/' + appointmentId, update);
  }

  public getAvailableTime(): Observable<Array<AppointmentTime>> {
    return this.http.get<Array<AppointmentTime>>('/api/appointments/time');
  }
}
