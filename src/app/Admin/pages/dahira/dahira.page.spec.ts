import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DahiraPage } from './dahira.page';

describe('DahiraPage', () => {
  let component: DahiraPage;
  let fixture: ComponentFixture<DahiraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DahiraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
