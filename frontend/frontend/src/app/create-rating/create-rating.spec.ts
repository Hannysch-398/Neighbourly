import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRating } from './create-rating';

describe('CreateRating', () => {
  let component: CreateRating;
  let fixture: ComponentFixture<CreateRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
