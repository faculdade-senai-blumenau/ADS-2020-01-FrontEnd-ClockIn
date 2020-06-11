import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovacoesPendentesComponent } from './aprovacoes-pendentes.component';

describe('AprovacoesPendentesComponent', () => {
  let component: AprovacoesPendentesComponent;
  let fixture: ComponentFixture<AprovacoesPendentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprovacoesPendentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprovacoesPendentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
