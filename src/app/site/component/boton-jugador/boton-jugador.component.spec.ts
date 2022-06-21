import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonJugadorComponent } from './boton-jugador.component';

describe('BotonJugadorComponent', () => {
  let component: BotonJugadorComponent;
  let fixture: ComponentFixture<BotonJugadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonJugadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
