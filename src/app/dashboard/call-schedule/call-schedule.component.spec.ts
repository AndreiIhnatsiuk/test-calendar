import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CallScheduleComponent} from './call-schedule.component';

describe('CallScheduleComponent', () => {
  let component: CallScheduleComponent;
  let fixture: ComponentFixture<CallScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallScheduleComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
