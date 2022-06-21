import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcadorEventoComponent } from './marcador-evento.component';

describe('MarcadorEventoComponent', () => {
  let component: MarcadorEventoComponent;
  let fixture: ComponentFixture<MarcadorEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcadorEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcadorEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
