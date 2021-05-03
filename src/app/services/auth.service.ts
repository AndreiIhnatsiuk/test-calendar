import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenInfo} from '../entities/token-info';
import {LocalStorageService} from './local-storage.service';
import {Personal} from '../entities/personal';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  private currentUserSubject: BehaviorSubject<TokenInfo>;
  public currentUser: Observable<TokenInfo>;

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {
    this.currentUserSubject = new BehaviorSubject<TokenInfo>(JSON.parse(localStorageService.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): TokenInfo {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<TokenInfo> {
    const body = new HttpParams()
      .append('username', email)
      .append('password', password)
      .append('grant_type', 'password');

    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa('web:web'));

    return this.http.post('/oauth/token', body, {
      headers: headers
    }).pipe(map(data => {
      const userData = <any>data;
      const token = <string>userData.access_token;
      if (token) {
        const user = new TokenInfo(token);
        this.localStorageService.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }
    }));
  }

  public resetPassword(email: string): Observable<any> {
    return this.http.post('/api/reset-password-tokens', {email: email});
  }

  public updatePassword(token: string, password: string): Observable<any> {
    return this.http.put('/api/user-passwords', {token: token, password: password});
  }

  logout() {
    this.localStorageService.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getMe(): Observable<Personal> {
    return this.http.get<Personal>('/api/users/me');
  }

  updatePersonal(phone: string, repository: string, emailNotifications: any): Observable<Personal> {
    const body: { [k: string]: any } = {emailNotifications: emailNotifications};
    if (phone) {
      body.phone = '+375' + phone;
    }
    if (repository) {
      body.repository = repository;
    }
    return this.http.patch<Personal>('/api/users/me', body);
  }

  create(name: string, email: string, password: string, offerNotification: boolean): Observable<any> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa('web:web'));

    return this.http.post('/api/users', {name, email, level: 'BEGINNER', password, offerNotification}, {headers: headers});
  }
}
