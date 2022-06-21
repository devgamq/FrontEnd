import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonConjuntoComponent } from './boton-conjunto.component';

describe('BotonConjuntoComponent', () => {
  let component: BotonConjuntoComponent;
  let fixture: ComponentFixture<BotonConjuntoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonConjuntoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
