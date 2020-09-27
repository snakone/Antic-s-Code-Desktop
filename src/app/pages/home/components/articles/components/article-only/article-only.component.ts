import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { ArticlesService } from '@core/services/services.index';
import { Article, ArticleResponse } from '@shared/interfaces/interfaces';

@Component({
  selector: 'app-article-only',
  templateUrl: './article-only.component.html',
  styleUrls: ['./article-only.component.scss']
})
export class ArticleOnlyComponent implements OnInit, OnDestroy {

  article: Article;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private _article: ArticlesService
  ) { }

  ngOnInit() {
    this.getArticleBySlug();
   }

  private getArticleBySlug(): void {
    this.route.paramMap
    .pipe(
      takeUntil(this.unsubscribe$),
      switchMap((res: ParamMap) => {
        const slug = res.get('slug');
        return this._article.getArticleBySlug(slug);
      })
    )
    .subscribe((res: Article) => this.article = res);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
