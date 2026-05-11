import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRatingComments } from './show-rating-comments';

describe('ShowRatingComments', () => {
  let component: ShowRatingComments;
  let fixture: ComponentFixture<ShowRatingComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowRatingComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRatingComments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
