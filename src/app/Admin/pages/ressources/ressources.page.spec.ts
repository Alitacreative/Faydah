import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RessourcesPage } from './ressources.page';

describe('RessourcesPage', () => {
  let component: RessourcesPage;
  let fixture: ComponentFixture<RessourcesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RessourcesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
