import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Slot} from '../../entities/calendar/slot';
import {SlotDto} from '../../entities/calendar/slotDto';

@Injectable({providedIn: 'root'})
export class SlotService {
  constructor(private http: HttpClient) {
  }

  public get(mentorId: number): Observable<Array<Slot>> {
    return this.http.get<Array<Slot>>('/api/slots?mentorId=' + mentorId);
  }

  public set(slotDto: SlotDto): Observable<any> {
    return this.http.post('/api/slots', slotDto);
  }

  public delete(date: string, from: string, to: string): Observable<any> {
    return this.http.delete('/api/slots?date=' + date + '&from=' + from + '&to=' + to);
  }

}
