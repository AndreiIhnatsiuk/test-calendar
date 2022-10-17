import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Slot} from '../../entities/calendar/slot';
import {SlotRequest} from '../../entities/calendar/slot-request';
import {SlotScheduleRequest} from '../../entities/calendar/slot-schedule-request';
import {SlotScheduleUpdate} from '../../entities/calendar/slot-schedule-update';

@Injectable({providedIn: 'root'})
export class SlotService {
  constructor(private http: HttpClient) {
  }

  public get(mentorId: number): Observable<Array<Slot>> {
    return this.http.get<Array<Slot>>('/api/slots?mentorId=' + mentorId);
  }

  public set(slotDto: SlotRequest): Observable<any> {
    return this.http.post('/api/slots', slotDto);
  }

  public delete(date: string, from: string, to: string): Observable<any> {
    return this.http.delete('/api/slots?date=' + date + '&from=' + from + '&to=' + to);
  }

  public createSchedule(slotScheduleRequest: SlotScheduleRequest): Observable<SlotScheduleRequest> {
    return this.http.post<SlotScheduleRequest>('/api/calendar/slot-schedule', slotScheduleRequest);
  }

  public getSchedule(): Observable<Array<SlotScheduleRequest>> {
    return this.http.get<Array<SlotScheduleRequest>>('/api/calendar/slot-schedule');
  }

  public patchSchedule(scheduleId: number, slotScheduleUpdate: SlotScheduleUpdate): Observable<any> {
    return this.http.patch('/api/calendar/slot-schedule/' + scheduleId, slotScheduleUpdate);
  }

}
