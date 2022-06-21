import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeportesAcreditacionComponent } from './deportes-acreditacion.component';

describe('DeportesAcreditacionComponent', () => {
  let component: DeportesAcreditacionComponent;
  let fixture: ComponentFixture<DeportesAcreditacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeportesAcreditacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeportesAcreditacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
