import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunZone } from './fun-zone';

describe('FunZone', () => {
  let component: FunZone;
  let fixture: ComponentFixture<FunZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunZone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunZone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
