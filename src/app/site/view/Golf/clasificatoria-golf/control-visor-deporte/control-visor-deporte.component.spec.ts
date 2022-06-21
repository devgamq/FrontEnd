import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlVisorDeporteComponent } from './control-visor-deporte.component';

describe('ControlVisorComponent', () => {
  let component: ControlVisorDeporteComponent;
  let fixture: ComponentFixture<ControlVisorDeporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlVisorDeporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlVisorDeporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
