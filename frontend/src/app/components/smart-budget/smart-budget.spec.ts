import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartBudget } from './smart-budget';

describe('SmartBudget', () => {
  let component: SmartBudget;
  let fixture: ComponentFixture<SmartBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartBudget],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartBudget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
