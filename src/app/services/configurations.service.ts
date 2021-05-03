import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Configuration} from '../entities/configuration';

@Injectable({providedIn: 'root'})
export class ConfigurationService {
  constructor(private http: HttpClient) {
  }

  public getConfiguration(): Observable<Configuration> {
    return this.http.get<Configuration>('/api/configurations');
  }
}
