import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionDeporteComponent } from './acreditacion-deporte.component';

describe('AcreditacionDeporteComponent', () => {
  let component: AcreditacionDeporteComponent;
  let fixture: ComponentFixture<AcreditacionDeporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcreditacionDeporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcreditacionDeporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
