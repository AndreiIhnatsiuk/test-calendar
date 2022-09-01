import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationScheduleComponent } from './consultation-schedule.component';

describe('ConsultationScheduleComponent', () => {
  let component: ConsultationScheduleComponent;
  let fixture: ComponentFixture<ConsultationScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
