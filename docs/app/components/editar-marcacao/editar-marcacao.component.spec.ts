import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMarcacaoComponent } from './editar-marcacao.component';

describe('EditarMarcacaoComponent', () => {
  let component: EditarMarcacaoComponent;
  let fixture: ComponentFixture<EditarMarcacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarMarcacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMarcacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
