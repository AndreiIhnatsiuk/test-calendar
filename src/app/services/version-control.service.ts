import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {filter, flatMap, map} from 'rxjs/operators';
import {version} from '../../environments/version';

@Injectable({providedIn: 'root'})
export class VersionControlService {
  public readonly updateObservable: Observable<string>;

  constructor(private http: HttpClient) {
    this.updateObservable = timer(15_000, 90_000).pipe(
      flatMap(() => this.getVersion()),
      filter(v => v !== version.version)
    );
  }

  public getVersion(): Observable<string> {
    return this.http.get<{version: string}>('/assets/version.json?' + new Date().getTime())
      .pipe(map(x => x.version));
  }
}
