import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article, Link, NotificationPayload } from '@shared/interfaces/interfaces';
import { Store } from '@ngrx/store';
import { AppState, URI } from '@app/app.config';
import * as fromDrafts from '@core/ngrx/selectors/draft.selectors';
import * as DraftActions from '@core/ngrx/actions/draft.actions';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CrafterService } from '@core/services/crafter/crafter.service';
import { DraftsService } from '@core/services/drafts/drafts.service';
import { PushService } from '@app/core/services/push/push.service';
import { DRAFT_PUSH } from '@app/shared/shared.data';

@Component({
  selector: 'app-create-confirm-content',
  templateUrl: './create-confirm-content.component.html',
  styleUrls: ['./create-confirm-content.component.scss']
})

export class CreateConfirmContentComponent implements OnInit, OnDestroy {

  draft: Article;
  inputs: number[] = [0, 1];
  name: string[] = ['', ''];
  link: string[] = ['', ''];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private crafter: CrafterService,
    private _draft: DraftsService,
    private sw: PushService
  ) { }

  ngOnInit() {
    this.getArticleDraft();
  }

  private getArticleDraft(): void {
    this.store.select(fromDrafts.getDraft)
    .pipe(
      takeUntil(this.unsubscribe$),
      filter(res => res && !!res)
    )
     .subscribe((res: Article) => {
        this.draft = res;
        this.checkDraftLinks();
     })
  }

  submit(): void {
    this.insertLinks();
    if (this.draft.status === 'Approved') {
      this._draft.unPublishDraft(this.draft)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(_ => {
        this.store.dispatch(DraftActions.removeDraft());
        this.crafter.toaster('Artículo archivado', `Tu Artículo ha pasado a
                                                    pendiente hasta que un moderador
                                                    revise los cambios`, 'info');
        this.router.navigateByUrl('/home');
        this.sw.sendNotification(
          this.setNotification(Object.assign({}, DRAFT_PUSH), _)
        ).toPromise().then();
      });
    } else {
      this._draft.updateDraft(this.draft)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(_ => {
        this.store.dispatch(DraftActions.removeDraft());
        this.crafter.toaster('Artículo actualizado', '¡Genial!', 'success');
        this.router.navigateByUrl('/home');
        this.sw.sendNotification(
          this.setNotification(Object.assign({}, DRAFT_PUSH), _)
        ).toPromise().then();
      });
    }
  }

  private insertLinks(): void {
    this.draft.links = [];
    this.inputs.forEach(i => {
      if(this.name[i] && this.link[i]) {
        this.draft.links.push({
          name: this.name[i],
          url: this.link[i]
        });
      }
    });
  }

  public addLink(): void {
    if (this.inputs.length >= 2 || this.inputs.length < 1) { return; }
    this.inputs.push(this.inputs.length);
  }

  public removeLink(): void {
    this.inputs.splice(this.inputs.length -1, 1);
    this.name[1] = '';
    this.link[1] = ''
  }

  private checkDraftLinks(): void {
    if (this.draft.links.length > 0) {
      this.draft.links.forEach((link: Link, i) => {
        this.name[i] = link.name;
        this.link[i] = link.url;
      });
    }
  }

  private setNotification(payload: NotificationPayload,
                          article: Article): NotificationPayload {
    payload.image = article.cover;
    payload.body = payload.body
                   .concat(`.\n${article.author} ha modificado un borrador.\n${article.title}.`);
    return payload;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
