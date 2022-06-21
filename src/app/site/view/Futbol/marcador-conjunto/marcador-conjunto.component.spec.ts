import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcadorConjuntoComponent } from './marcador-conjunto.component';

describe('MarcadorConjuntoComponent', () => {
  let component: MarcadorConjuntoComponent;
  let fixture: ComponentFixture<MarcadorConjuntoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcadorConjuntoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcadorConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
