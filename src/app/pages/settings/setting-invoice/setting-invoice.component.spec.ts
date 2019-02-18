import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingInvoiceComponent } from './setting-invoice.component';

describe('SettingInvoiceComponent', () => {
  let component: SettingInvoiceComponent;
  let fixture: ComponentFixture<SettingInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
