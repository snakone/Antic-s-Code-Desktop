import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { APP_CONSTANTS } from '@app/app.config';
import { ArticleResponse, Article } from '@shared/interfaces/interfaces';
import { filter, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable()

export class ArticlesService {

  readonly API_ARTICLES = environment.api + 'articles/';

  constructor(private http: HttpService) { }

  public getArticleBySlug(slug: string): Observable<Article> {
    return this.http
      .get<ArticleResponse>(environment.api + 'article/' + slug)
      .pipe(
        filter(res => res && !!res.ok),
        map(_ => _.article)
      );
  }

  public getArticlesList(): Observable<Article[]> {
    return this.http
      .get<ArticleResponse>(this.API_ARTICLES + 'list')
      .pipe(
        filter(res => res && !!res.ok),
        map(_ => _.articles)
      );
  }

}
