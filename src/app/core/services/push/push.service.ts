import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { NotificationPayload, SWResponse } from '@shared/interfaces/interfaces';
import { environment } from '@environments/environment';

@Injectable()

export class PushService {

  readonly API_NOTIFICATION = environment.api + 'notification';

  constructor(private http: HttpService) { }

  public sendNotification(
    payload: NotificationPayload
  ): Observable<SWResponse> {
    return this.http.post(this.API_NOTIFICATION, {payload});
  }

}
