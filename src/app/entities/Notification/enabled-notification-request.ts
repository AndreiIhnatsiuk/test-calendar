export class EnabledNotificationRequest {
  notificationTypeId: string;
  channelId: string;

  constructor(notificationTypeId: string, channelId: string) {
    this.notificationTypeId = notificationTypeId;
    this.channelId = channelId;
  }
}
