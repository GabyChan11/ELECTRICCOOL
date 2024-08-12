import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProvidersPage } from './providers.page';

describe('ProvidersPage', () => {
  let component: ProvidersPage;
  let fixture: ComponentFixture<ProvidersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProvidersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
