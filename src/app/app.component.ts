import {Component} from '@angular/core';
import {VersionControlService} from './services/version-control.service';
import {FakeGtagService} from './services/fake-gtag.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ITman Study';

  // don't delete: gtag. It needs for it initialization
  constructor(gtag: FakeGtagService, versionControlService: VersionControlService) {
    let alertShown = false;
    versionControlService.updateObservable.subscribe(() => {
      if (!alertShown) {
        alertShown = true; // workaround to not show alert twice
        alert('Вышла новая версия платформы. Страница обновится для продолжение корректной работы платформы.');
        location.reload();
        alertShown = false;
      }
    });
  }
}
