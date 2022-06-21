import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCompetidorComponent } from './dialogo-competidor.component';

describe('DialogoCompetidorComponent', () => {
  let component: DialogoCompetidorComponent;
  let fixture: ComponentFixture<DialogoCompetidorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCompetidorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCompetidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
