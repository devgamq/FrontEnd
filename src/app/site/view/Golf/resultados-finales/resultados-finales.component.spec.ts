import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosFinalesComponent } from './resultados-finales.component';

describe('ResultadosFinalesComponent', () => {
  let component: ResultadosFinalesComponent;
  let fixture: ComponentFixture<ResultadosFinalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadosFinalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadosFinalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
