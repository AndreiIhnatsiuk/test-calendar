import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramTokenComponent } from './telegram-token.component';

describe('TelegramTokenComponent', () => {
  let component: TelegramTokenComponent;
  let fixture: ComponentFixture<TelegramTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelegramTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
