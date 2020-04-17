import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '@app/app.config';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { NotificationPayload, SWResponse } from '@app/shared/interfaces/interfaces';

@Injectable()

export class PushService {

  readonly API_NOTIFICATION = APP_CONSTANTS.END_POINT + 'notification';

  constructor(private http: HttpService) { }

  public sendNotification(payload: NotificationPayload): Observable<SWResponse> {
    return this.http.post(this.API_NOTIFICATION, {payload});
  }

}
