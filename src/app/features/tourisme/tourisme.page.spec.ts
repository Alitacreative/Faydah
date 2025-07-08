import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TourismePage } from './tourisme.page';

describe('TourismePage', () => {
  let component: TourismePage;
  let fixture: ComponentFixture<TourismePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TourismePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
