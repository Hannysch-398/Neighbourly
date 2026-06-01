import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAndOverlayComponent } from './map-and-overlay-component';

describe('MapAndOverlayComponent', () => {
  let component: MapAndOverlayComponent;
  let fixture: ComponentFixture<MapAndOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapAndOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapAndOverlayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
