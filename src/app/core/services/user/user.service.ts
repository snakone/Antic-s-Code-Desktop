import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

import { HttpService } from '../http/http.service';
import { User, UserResponse } from '@shared/interfaces/interfaces';
import { StorageService } from '@core/storage/storage.service';
import { environment } from '@environments/environment';

@Injectable()

export class UserService {

  readonly API_USERS = environment.api + 'users';
  readonly API_TOKEN = environment.api + 'token';
  private user: User;

  constructor(
    private http: HttpService,
    private ls: StorageService
  ) { }

  public getUser(): User {
    return this.user || null;
  }

  public setUser(user: User): void {
    this.user = user;
  }

  public getUserById(id: string): Observable<User> {
    return this.http
      .get<UserResponse>(environment.api + `user/${id}`)
      .pipe(
        filter(res => res && !!res.ok),
        map(_ => _.user)
      );
  }

  public refreshToken(id: string): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(this.API_TOKEN + `/${id}`, null)
      .pipe(
        filter(res => res && !!res.ok),
        tap(res => this.setToken(res))
      );
  }

  public verifyToken(): Observable<User> {
    return this.http
      .get<UserResponse>(this.API_TOKEN)
      .pipe(
        filter(res => res && !!res),
        map(res => res.user),
        tap(res => this.setUser(res))
      );
  }

  private setToken(data: UserResponse): void {
    this.ls.setKey('token', data.token);
    this.setUser(data.user);
  }

  public logout(): void {
    this.ls.setKey('token', null);
    this.user = null;
    document.body.removeAttribute('class'); // Remove Theme
    document.body.removeAttribute('style');
  }

}


