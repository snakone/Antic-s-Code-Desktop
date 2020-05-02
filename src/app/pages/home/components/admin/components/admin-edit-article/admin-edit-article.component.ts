import { Component, OnInit, NgZone } from '@angular/core';
import { Article, ArticleResponse, NotificationPayload } from '@shared/interfaces/interfaces';
import { Subject, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DraftsService, CrafterService, PushService } from '@core/services/services.index';
import { HttpErrorResponse } from '@angular/common/http';
import { CHECKSTATUS, PUBLISH_PUSH } from '@app/shared/shared.data';
import { Store } from '@ngrx/store';
import { AppState, URI } from '@app/app.config';
import * as DraftActions from '@core/ngrx/actions/draft.actions';
import * as remote from 'remote-file-size';

@Component({
  selector: 'app-admin-edit-article',
  templateUrl: './admin-edit-article.component.html',
  styleUrls: ['./admin-edit-article.component.scss']
})

export class AdminEditArticleComponent implements OnInit {

  draft: Article;
  private unsubscribe$ = new Subject<void>();
  check = CHECKSTATUS;
  public coverSize: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _draft: DraftsService,
    private store: Store<AppState>,
    private router: Router,
    private crafter: CrafterService,
    private zone: NgZone,
    private sw: PushService
  ) { }

  ngOnInit() {
    this.getDraftBySlug();
  }

  private getDraftBySlug(): void {
    this.activatedRoute.paramMap
    .pipe(
      takeUntil(this.unsubscribe$),
      switchMap((res: ParamMap) => {
        const slug = res.get('slug');
        return this._draft.getDraftBySlug(slug);
      })
    )
    .subscribe((res: Article) => {
        this.draft = res;
        this.getCoverSize(this.draft.cover);
    });
  }

  public previewArticle(): void {
    this.store.dispatch(
      DraftActions.savePreviewArticle({article: this.draft})
    );
    this.router.navigateByUrl('home/admin/preview');
  }

  public publish(): void {
    const ok = Object.values(this.draft.check).every(i => i.ok);
    Object.values(this.draft.check).forEach(c => {
      if (c.ok) {
        c.cause = null;
      }
    });

    if (this.draft.links.length === 0) {
      this.draft.check.hasGoodLinks.ok = true;
    }

    if (ok) {
      this._draft.publishDraft(this.draft)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: Article) => {
          this.store.dispatch(DraftActions.removeDraft());
          this.crafter.toaster('Artículo publicado', '!Genial!', 'success');
          this.router.navigateByUrl('home/admin');
          this.sw.sendNotification(
            this.setNotification(Object.assign({}, PUBLISH_PUSH), res)
          ).subscribe();
      });
    } else {
      this._draft.updateDraft(this.draft)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(_ => {
        this.store.dispatch(DraftActions.removeDraft());
        this.crafter.toaster('Artículo actualizado', '!Bien!', 'success');
        this.router.navigateByUrl('home/admin');
      });
    }
  }

  public getCoverSize(cover: string) {
    this.zone.runOutsideAngular(() => {
      remote(cover, (err: any, size: number) => {
        this.zone.run(() => {
          this.coverSize = (size / 1000).toFixed(2);
          if (Number(this.coverSize) > 100) {
            this.draft.check.hasGoodCover.ok = false;
          }

          if (isNaN(size)) {
            this.coverSize = '0';
            this.draft.check.hasGoodCover.ok = false;
          }
        });
      })
    });
  }

  private setNotification(payload: NotificationPayload,
                          article: Article): NotificationPayload {
    payload.image = article.cover;
    payload.data.url = `${URI}/article/${article.slug}`;
    payload.body = payload.body
                   .concat(`.\n${article.title}\nEscrito por ${article.author}.`);
    return payload;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
