import {EmailNotifications} from './email-notifications';

export interface Personal {
  id: string;
  name: string;
  phone: string;
  analyticsId: string;
  email: string;
  repository: string;
  emailNotifications: EmailNotifications;
  confirmedEmail: boolean;
  telegramUsername: string;
}
