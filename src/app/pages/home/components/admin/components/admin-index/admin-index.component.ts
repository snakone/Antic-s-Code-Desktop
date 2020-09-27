import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { AppState } from '@app/app.config';
import { Subject } from 'rxjs';
import { Article, ArticleResponse } from '@app/shared/interfaces/interfaces';
import * as fromDrafts from '@app/core/ngrx/selectors/draft.selectors';
import * as DraftActions from '@app/core/ngrx/actions/draft.actions';
import { takeUntil } from 'rxjs/operators';
import { DraftsService, CrafterService } from '@app/core/services/services.index';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.scss']
})

export class AdminIndexComponent implements OnInit {

  draft: Article;
  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<AppState>,
              private _draft: DraftsService,
              private crafter: CrafterService,
              private location: Location) { }

  ngOnInit() {
    this.getpreviewDraft();
  }

  private getpreviewDraft(): void {
    this.store.select(fromDrafts.getPreviewArticle)
    .pipe(takeUntil(this.unsubscribe$))
     .subscribe((res: Article) => {
       res ? this.draft = res : this.draft = null;
     })
  }

  updateMessage(): void {
    this._draft.updateDraftMessage(this.draft.message, this.draft._id)
    .subscribe(_ => {
      this.crafter.toaster('Mensaje actualizado', '!Bien!', 'success');
      this.store.dispatch(DraftActions.resetPreviewDraft());
      this.location.back();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
