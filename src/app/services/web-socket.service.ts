import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {RxStompService} from '@stomp/ng2-stompjs';
import {AuthService} from './auth.service';
import {filter, flatMap, map, take} from 'rxjs/operators';
import {rxStompConfig} from '../rx-stomp.config';
import { IMessage } from '@stomp/stompjs';
import {IRxStompPublishParams} from '@stomp/rx-stomp/esm5/rx-stomp-publish-params';

@Injectable({providedIn: 'root'})
export class WebSocketService {
  private rxStompService: ReplaySubject<RxStompService>;
  private subjects: Map<string, Subject<any>>;
  private nextConfirmId: number;

  constructor(private authService: AuthService) {
    this.subjects = new Map<string, Subject<any>>();
    this.nextConfirmId = 1;
    this.rxStompService = new ReplaySubject<RxStompService>(1);
    this.authService.currentUser
      .pipe(
        filter(token => token !== null),
        take(1)
      ).subscribe(token => {
        rxStompConfig.connectHeaders = {
          auth: token.token
        };
        const rxStompService = new RxStompService();
        rxStompService.configure(rxStompConfig);
        rxStompService.activate();
        this.rxStompService.next(rxStompService);
      });
    this.watchIMessage('/user/responses').subscribe(message => {
      const confirmId = message.headers.confirm;
      const subject = this.subjects.get(confirmId);
      if (subject != null) {
        this.subjects.delete(confirmId);
        const body = JSON.parse(message.body) as WebSocketResponse;
        if (body.status === 'Ok') {
          subject.next(body.body);
        } else {
          subject.error(body.body);
        }
      }
    });
  }

  private watchIMessage(url: string): Observable<IMessage> {
    return this.rxStompService.pipe(
      flatMap(service => service.watch(url))
    );
  }

  public watch<T>(url: string): Observable<T> {
    return this.watchIMessage(url).pipe(map(message => JSON.parse(message.body) as T));
  }

  private publish(parameters: IRxStompPublishParams): void {
    this.rxStompService.pipe(take(1)).subscribe(service => service.publish(parameters));
  }

  public send<T>(destination: string, message: object): Observable<T> {
    const confirmId = (this.nextConfirmId++).toString();
    const subject = new Subject<T>();
    this.subjects.set(confirmId, subject);
    this.publish({
      destination,
      body: JSON.stringify(message),
      headers: {
        confirm: confirmId
      }
    });
    return subject;
  }
}

class WebSocketResponse {
  status: string;
  body: any;
}
