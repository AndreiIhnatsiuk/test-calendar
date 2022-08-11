import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NotificationType} from '../entities/Notification/notification-type';
import {NotificationChannelInfo} from '../entities/Notification/notification-channel-info';
import {EnabledNotificationRequest} from '../entities/Notification/enabled-notification-request';
import {EnabledNotification} from '../entities/Notification/enabled-notification';

@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private http: HttpClient
  ) {
  }

  public getNotificationsTypes(): Observable<Array<NotificationType>> {
    return this.http.get<Array<NotificationType>>('/api/notifications/types');
  }

  public getNotificationsChannels(): Observable<Array<NotificationChannelInfo>> {
    return this.http.get<Array<NotificationChannelInfo>>('/api/notifications/channels');
  }

  public makeNotificationEnabled(enabledNotificationRequest: EnabledNotificationRequest): Observable<EnabledNotification> {
    return this.http.post<EnabledNotification>('/api/notifications/enabled', enabledNotificationRequest);
  }

  public getAllEnabledNotifications(): Observable<Array<EnabledNotification>> {
    return this.http.get<Array<EnabledNotification>>('/api/notifications/enabled');
  }

  public disableNotification(id: number): Observable<any> {
    return this.http.delete('/api/notifications/enabled/' + id);
  }


}
