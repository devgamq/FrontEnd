import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallePersonaAcreditacionComponent } from './detalle-persona-acreditacion.component';

describe('DetallePersonaAcreditacionComponent', () => {
  let component: DetallePersonaAcreditacionComponent;
  let fixture: ComponentFixture<DetallePersonaAcreditacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePersonaAcreditacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePersonaAcreditacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
