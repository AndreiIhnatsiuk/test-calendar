import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorSubmissionDialogComponent } from './mentor-submission-dialog.component';

describe('MentorSubmissionDialogComponent', () => {
  let component: MentorSubmissionDialogComponent;
  let fixture: ComponentFixture<MentorSubmissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorSubmissionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorSubmissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
