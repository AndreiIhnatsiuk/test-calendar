import {Component, OnInit} from '@angular/core';
import {NotificationType} from '../../entities/notification/notification-type';
import {NotificationChannelInfo} from '../../entities/notification/notification-channel-info';
import {EnabledNotification} from '../../entities/notification/enabled-notification';
import {AuthService} from '../../auth/auth.service';
import {NotificationService} from '../../services/notification.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {zip} from 'rxjs';
import {EnabledNotificationRequest} from '../../entities/notification/enabled-notification-request';

@Component({
  selector: 'app-notification-table',
  templateUrl: './notification-table.component.html',
  styleUrls: ['./notification-table.component.scss']
})
export class NotificationTableComponent implements OnInit {
  sending: Map<string, boolean> = new Map();
  notificationTypes: NotificationType[];
  notificationChannelInfo: NotificationChannelInfo[];
  enabledNotifications: EnabledNotification[];
  dataSource = [];
  columns = [
    {
      columnDef: 'Тип уведомлений',
    }
  ];
  displayedColumns = this.columns.map(c => c.columnDef);

  constructor(private authService: AuthService,
              private notificationService: NotificationService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    zip(
      this.notificationService.getNotificationsTypes(),
      this.notificationService.getNotificationsChannels(),
      this.notificationService.getAllEnabledNotifications(),
    ).subscribe(([types, channels, enabledNotifications]) => {
      this.notificationTypes = types;
      this.notificationChannelInfo = channels;
      this.enabledNotifications = enabledNotifications;
      channels.forEach(channel => {
        this.columns.push({
          columnDef: channel.name,
        });
      });
      this.displayedColumns = this.columns.map(c => c.columnDef);
      this.notificationTypes.forEach(type => {
        const row = {};
        row ['type'] = type;
        this.notificationChannelInfo.forEach(channel => {
          const enabled = this.enabledNotifications.find(x => channel.name === x.channelId && x.notificationTypeId === type.id);
          row[channel.name] = enabled !== undefined ? enabled.id : null;
        });
        this.dataSource.push(row);
      });
    });
  }

  subscribe(type: string, channel: string) {
    const key = 'type: ' + type + ' channel: ' + channel;
    this.sending.set(key, true);
    this.notificationService.makeNotificationEnabled(new EnabledNotificationRequest(type, channel)).subscribe(((enabledNotification) => {
      const row = this.dataSource.find(x => x.type.id === type);
      row[channel] = enabledNotification.id;
      this.sending.set(key, false);
      this.snackBar.open('Вы подписались на получение уведомлений ' + type + ' посредством ' + channel, undefined, {
        duration: 10000
      });
    }), e => {
      this.snackBar.open(e.error.message, undefined, {
        duration: 10000
      });
    });
  }

  unsubscribe(id: number, index: number, channel: string) {
    const row = this.dataSource[index];
    const type = row['type'].id;
    const key = 'type: ' + type + ' channel: ' + channel;
    this.sending.set(key, true);
    this.notificationService.disableNotification(id).subscribe((() => {
      if (row[channel] === id) {
        row[channel] = null;
      }
      this.sending.set(key, false);

      this.snackBar.open('Вы отписались от данного уведомления', undefined, {
        duration: 10000
      });
    }));
  }

  isChecked(id: number) {
    for (const item of this.enabledNotifications) {
      if (id === item.id) {
        return true;
      }
    }
    return false;
  }
}


