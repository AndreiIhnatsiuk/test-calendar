import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Module} from '../entities/module';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ModuleService {
  constructor(private http: HttpClient) {
  }

  public getModules(): Observable<Array<Module>> {
    return this.http.get<Array<Module>>('/api/modules/');
  }

  public getAvailableModules(): Observable<Set<number>> {
    return this.http.get<Array<number>>('/api/available-modules/')
      .pipe(map(modules => new Set(modules)));
  }
}
