import { Component, OnInit, OnDestroy } from '@angular/core';
import * as DraftActions from '@app/core/ngrx/actions/draft.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.config';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit,OnDestroy {

  constructor(private store: Store<AppState>) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.store.dispatch(DraftActions.resetPreviewDraft());
  }

}
