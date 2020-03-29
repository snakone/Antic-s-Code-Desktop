import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '@app/shared/interfaces/interfaces';

@Component({
  selector: 'app-single-article-intro',
  templateUrl: './single-article-intro.component.html',
  styleUrls: ['./single-article-intro.component.scss']
})

export class SingleArticleIntroComponent implements OnInit {

  @Input() draft: Article;
  @Output() start = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

}
