import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disclaimer } from './disclaimer';

describe('Disclaimer', () => {
  let component: Disclaimer;
  let fixture: ComponentFixture<Disclaimer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disclaimer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Disclaimer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
