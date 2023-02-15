import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class FakeGtagService {
  constructor() {
  }

  public event(action: string, params?: { event_category?: string, event_label?: string, value?: any, [key: string]: any }): void {
  }

  public setUserId(userId: string): void {
  }

}
