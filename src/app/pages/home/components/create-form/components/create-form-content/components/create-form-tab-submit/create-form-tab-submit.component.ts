import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User, Article } from '@shared/interfaces/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService, CrafterService } from '@core/services/services.index';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/app.config';
import { CATEGORIES, LANGUAGES, LEVELS, TAGS } from '@shared/shared.data';
import * as DraftActions from '@core/ngrx/actions/draft.actions';
import { DraftsService } from '@core/services/drafts/drafts.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-form-tab-submit',
  templateUrl: './create-form-tab-submit.component.html',
  styleUrls: ['./create-form-tab-submit.component.scss']
})

export class CreateFormTabSubmitComponent implements OnInit {

  @Output() back = new EventEmitter<void>();
  user: User;
  articleForm: FormGroup;
  categories = CATEGORIES;
  languages = LANGUAGES;
  tagsList = TAGS;
  levelsList = LEVELS;
  imagePattern = '^.+\.(([pP][nN][gG])|([jJ][pP][gG]))$';  // Png, Jpg
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _user: UserService,
    private _draft: DraftsService,
    private router: Router,
    private crafter: CrafterService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.user = this.getUser();
    this.createArticleForm();
  }

  get title() { return this.articleForm.get('title'); }
  get category() { return this.articleForm.get('category'); }
  get tags() { return this.articleForm.get('tags'); }
  get level() { return this.articleForm.get('level'); }
  get cover() { return this.articleForm.get('cover'); }
  get summary() { return this.articleForm.get('summary'); }

  private getUser(): User {
    return this._user.getUser();
  }

  private createArticleForm(): void {
    this.articleForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(35)
      ]),
      author: new FormControl({ value: this.user.name, disabled: true },[
        Validators.required
      ]),
      category: new FormControl(null, [Validators.required]),
      tags: new FormControl(null, [
        Validators.required,
        this.selectValidator(3).bind(this)
      ]),
      summary: new FormControl(null, [
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(600)
      ]),
      level: new FormControl(null, [Validators.required]),
      cover: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(this.imagePattern)
      ])
    });
  }

  public onSubmit(): void {
      if (this.articleForm.invalid) { return; }

      const {
        title,
        category,
        tags,
        level,
        cover,
        summary
      } = this.articleForm.value;

      const draft: Article = {
        title,
        author: this.user.name,
        user: this.user._id,
        category,
        message: 'Aquí va el mensaje',
        cover,
        summary,
        tags,
        level,
        type: 'draft'
      };

      this._draft.createDraft(draft)
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: Article) => {
          this.store.dispatch(DraftActions.saveDraft({draft: res}));
          this.router.navigateByUrl('/home/create');
          this.crafter.toaster('Artículo guardado', 'Copia de seguridad', 'success')
      });
  }

  private selectValidator(limit: number) {
    return (control: FormControl) => {
      const c = control.value;
      if (c && c.length > limit) {
        return { error: true };
      }
      return null;
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
