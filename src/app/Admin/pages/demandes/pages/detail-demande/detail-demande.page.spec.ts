import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailDemandePage } from './detail-demande.page';

describe('DetailDemandePage', () => {
  let component: DetailDemandePage;
  let fixture: ComponentFixture<DetailDemandePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDemandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
