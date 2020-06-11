import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspelhoPontoComponent } from './espelho-ponto.component';

describe('EspelhoPontoComponent', () => {
  let component: EspelhoPontoComponent;
  let fixture: ComponentFixture<EspelhoPontoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspelhoPontoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspelhoPontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
