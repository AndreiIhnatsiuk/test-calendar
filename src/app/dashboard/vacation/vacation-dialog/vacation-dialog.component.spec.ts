import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationDialogComponent } from './vacation-dialog.component';

describe('VacationDialogComponent', () => {
  let component: VacationDialogComponent;
  let fixture: ComponentFixture<VacationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
