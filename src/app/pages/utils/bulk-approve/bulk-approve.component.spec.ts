import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkApproveComponent } from './bulk-approve.component';

describe('BulkApproveComponent', () => {
  let component: BulkApproveComponent;
  let fixture: ComponentFixture<BulkApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
