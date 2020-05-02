import { Component, OnInit } from '@angular/core';
import { CreatorService } from '../../services/creator.service';

import {
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  takeUntil,
  mergeMap,
  tap,
  filter}
from 'rxjs/operators';

import { of, Subject } from 'rxjs';
import { Article } from '@shared/interfaces/interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.config';
import * as fromDrafts from '@core/ngrx/selectors/draft.selectors';
import * as DraftActions from '@core/ngrx/actions/draft.actions';
import { ActivatedRoute } from '@angular/router';
import { DraftsService } from '@core/services/drafts/drafts.service';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss']
})

export class CreateContentComponent implements OnInit {

  preview: string;
  draft: Article;
  loading = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private creator: CreatorService,
    private store: Store<AppState>,
    public activatedRoute: ActivatedRoute,
    private _draft: DraftsService
  ) { }

  ngOnInit() {
    this.getArticleDraft();
    this.initChanges();
  }

  public initChanges(): void {
    this.creator.previewChange
    .pipe(
      tap(() => this.loading = true),
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$),
      exhaustMap((res: string) => {
        this.preview = res;
        return of(res)
      }))
      .pipe(
        debounceTime(20000),
        mergeMap((res: string) => {
          this.draft.message = res;
          if (this.draft.status === 'Approved') {
            return of(null);
          }
          return this._draft.updateDraftMessage(
            res,
            this.draft._id
          )
        })
      ).subscribe(_ => {
        this.loading = false;
        this.store.dispatch(
          DraftActions.saveDraft({draft: this.draft})
        );
      });
  }

  private getArticleDraft(): void {
    this.store.select(fromDrafts.getDraft)
    .pipe(
      takeUntil(this.unsubscribe$),
      filter(res => res && !!res)
    )
     .subscribe((res: Article) => {
         this.draft = res;
         this.preview = res.message;
     })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
