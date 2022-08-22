export class TelegramToken {
  constructor(token: number, expiredDate: string) {
    this.token = token;
    this.expiredDate = expiredDate;
  }

  token: number;
  expiredDate: string;
}
