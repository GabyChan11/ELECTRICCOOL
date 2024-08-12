import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppliancesPage } from './appliances.page';

describe('AppliancesPage', () => {
  let component: AppliancesPage;
  let fixture: ComponentFixture<AppliancesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AppliancesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
