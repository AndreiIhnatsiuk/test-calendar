import {InjectableRxStompConfig} from '@stomp/ng2-stompjs';
import {environment} from '../environments/environment';

export const rxStompConfig: InjectableRxStompConfig = {
  brokerURL: environment.brokerURL,
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 1000,
  debug: (msg: string): void => {
    if (!environment.production) {
      // console.log(new Date(), msg);
    }
  }
};
