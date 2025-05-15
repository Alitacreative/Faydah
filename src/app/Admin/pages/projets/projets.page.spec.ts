import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjetsPage } from './projets.page';

describe('ProjetsPage', () => {
  let component: ProjetsPage;
  let fixture: ComponentFixture<ProjetsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
