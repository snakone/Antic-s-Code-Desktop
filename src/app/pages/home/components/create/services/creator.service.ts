import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()

export class CreatorService {

  previewChange = new Subject<string>();

  constructor() { }

   public makeChange(text: string): void {
    this.previewChange.next(text);
   }
}
