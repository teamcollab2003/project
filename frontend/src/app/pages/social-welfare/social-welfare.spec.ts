import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialWelfare } from './social-welfare';

describe('SocialWelfare', () => {
  let component: SocialWelfare;
  let fixture: ComponentFixture<SocialWelfare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialWelfare],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialWelfare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
