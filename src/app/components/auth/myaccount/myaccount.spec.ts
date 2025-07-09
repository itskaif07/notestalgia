import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myaccount } from './myaccount';

describe('Myaccount', () => {
  let component: Myaccount;
  let fixture: ComponentFixture<Myaccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myaccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myaccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
