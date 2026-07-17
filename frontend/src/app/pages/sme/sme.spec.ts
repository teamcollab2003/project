import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sme } from './sme';

describe('Sme', () => {
  let component: Sme;
  let fixture: ComponentFixture<Sme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sme],
    }).compileComponents();

    fixture = TestBed.createComponent(Sme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
