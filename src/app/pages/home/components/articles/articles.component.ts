import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '@core/services/articles/articles.service';
import { Article } from '@shared/interfaces/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  articles$: Observable<Article[]>

  constructor(private _article: ArticlesService) { }

  ngOnInit() {
    this.articles$ = this._article.getArticlesList();
  }

}
