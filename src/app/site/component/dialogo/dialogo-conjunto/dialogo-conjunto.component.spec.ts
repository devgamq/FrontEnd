import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConjuntoComponent } from './dialogo-conjunto.component';

describe('DialogoConjuntoComponent', () => {
  let component: DialogoConjuntoComponent;
  let fixture: ComponentFixture<DialogoConjuntoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoConjuntoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
