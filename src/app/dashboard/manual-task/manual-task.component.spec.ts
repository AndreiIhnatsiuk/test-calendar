import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualTaskComponent } from './manual-task.component';

describe('ManualTaskComponent', () => {
  let component: ManualTaskComponent;
  let fixture: ComponentFixture<ManualTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
