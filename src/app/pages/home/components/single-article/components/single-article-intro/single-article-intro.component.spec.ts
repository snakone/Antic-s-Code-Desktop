import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleArticleIntroComponent } from './single-article-intro.component';

describe('SingleArticleIntroComponent', () => {
  let component: SingleArticleIntroComponent;
  let fixture: ComponentFixture<SingleArticleIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleArticleIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleArticleIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
