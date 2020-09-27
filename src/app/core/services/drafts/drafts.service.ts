import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { environment } from '@environments/environment';
import { ArticleResponse, Article } from '@shared/interfaces/interfaces';
import { filter, map } from 'rxjs/operators';

@Injectable()

export class DraftsService {

  readonly API_DRAFTS = environment.api + 'drafts/';
  readonly API_USER = environment.api + 'user/';

  constructor(private http: HttpService) { }

  public getDrafts(): Observable<Article[]> {
    return this.http
      .get<ArticleResponse>(this.API_DRAFTS)
      .pipe(
        filter(res => res && !!res.ok),
        map(res => res.drafts)
      );
  }

  public getContentByUser(
    sort: string = 'any'
  ): Observable<ArticleResponse> {
    return this.http
      .get<ArticleResponse>(this.API_USER + 'content' + '?sort=' + sort)
      .pipe(
        filter(res => res && !!res.ok)
      );
  }

  public getDraftBySlug(slug: string): Observable<Article> {
    return this.http
      .get<ArticleResponse>(this.API_DRAFTS + slug)
      .pipe(
        filter(res => res && !!res.ok),
        map(res => res.draft)
      );
  }

  public createDraft(draft: Article): Observable<Article> {
    return this.http
      .post<ArticleResponse>(this.API_DRAFTS, draft)
      .pipe(
        filter(res => res && !!res.ok),
        map(res => res.draft)
      );
  }

  public updateDraft(draft: Article): Observable<Article> {
    return this.http
      .put<ArticleResponse>(this.API_DRAFTS, draft)
      .pipe(
        filter(res => res && !!res.ok),
        map(res => res.draft)
      );
  }

  public updateDraftMessage(
    message: string, id: string
  ): Observable<ArticleResponse> {
    return this.http
      .put<ArticleResponse>(this.API_DRAFTS + 'message/' + id, {message})
      .pipe(
        filter(res => res && !!res.ok)
      );
  }

  public publishDraft(draft: Article): Observable<Article> {
    return this.http
      .post<ArticleResponse>(this.API_DRAFTS + 'publish', draft)
      .pipe(
        filter(res => res && !!res.ok),
        map(res => res.article)
      );
  }

  public unPublishDraft(draft: Article): Observable<Article> {
    return this.http
      .post<ArticleResponse>(this.API_DRAFTS + 'unpublish', draft)
      .pipe(
        filter(res => res && !!res.ok),
        map(res => res.draft)
      );
  }

}
