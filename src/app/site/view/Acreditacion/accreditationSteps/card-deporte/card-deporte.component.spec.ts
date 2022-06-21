import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDeporteComponent } from './card-deporte.component';

describe('CardDeporteComponent', () => {
  let component: CardDeporteComponent;
  let fixture: ComponentFixture<CardDeporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDeporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDeporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
