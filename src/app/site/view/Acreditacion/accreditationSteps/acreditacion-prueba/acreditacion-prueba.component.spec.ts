import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionPruebaComponent } from './acreditacion-prueba.component';

describe('AcreditacionPruebaComponent', () => {
  let component: AcreditacionPruebaComponent;
  let fixture: ComponentFixture<AcreditacionPruebaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcreditacionPruebaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcreditacionPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
