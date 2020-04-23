import { Component, OnInit, Input } from '@angular/core';
import { Article } from '@app/shared/interfaces/interfaces';
import { FileService } from '@app/core/services/file/file.service';

@Component({
  selector: 'app-draft-card',
  templateUrl: './draft-card.component.html',
  styleUrls: ['./draft-card.component.scss']
})

export class DraftCardComponent implements OnInit {

  @Input() draft: Article;
  @Input() admin: boolean;

  constructor(private file: FileService) { }

  ngOnInit() { }

  public download(): void {
    this.file.saveFile(
      this.draft.message,
      this.draft.title,
      this.draft.author);
  }

}
