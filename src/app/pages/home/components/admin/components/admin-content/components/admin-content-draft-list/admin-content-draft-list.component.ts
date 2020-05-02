import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '@shared/interfaces/interfaces';
import { DraftsService } from '@core/services/drafts/drafts.service';
import { STATUSBUTTONS } from '@shared/shared.data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-content-draft-list',
  templateUrl: './admin-content-draft-list.component.html',
  styleUrls: ['./admin-content-draft-list.component.scss']
})

export class AdminContentDraftListComponent implements OnInit, OnDestroy {

  drafts: Article[];
  filteredDrafts: Article[] = [];
  buttons = STATUSBUTTONS.filter(s => s.status !== 'success');
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _draft: DraftsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getDraftList();
  }

  private getDraftList(): void {
    this._draft.getDrafts()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: Article[]) => {
      this.drafts = res;
      this.filteredDrafts = res;
    });
  }

  public sort(status: string): void {
    if (status === 'All') {
      this.filteredDrafts = this.drafts;
      return;
    }
    this.filteredDrafts = this.drafts
    .filter((draft: Article) => {
      return draft.status === status;
    });
  }

  public navigate(slug: string): void {
    this.router.navigateByUrl('/home/admin/edit/' + slug);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
