import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TelegramToken} from '../entities/telegram-token';

@Injectable({providedIn: 'root'})
export class TelegramService {
  constructor(private http: HttpClient) {
  }

  public bindTelegram(): Observable<TelegramToken> {
    return this.http.post<TelegramToken>('/api/confirmation-telegram-tokens', null);
  }

}
