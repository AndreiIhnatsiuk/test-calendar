import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTasksComponent } from './check-tasks.component';

describe('CheckTasksComponent', () => {
  let component: CheckTasksComponent;
  let fixture: ComponentFixture<CheckTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
