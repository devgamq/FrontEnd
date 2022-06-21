import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JornadaGolfComponent } from './jornada-golf.component';

describe('JornadaGolfComponent', () => {
  let component: JornadaGolfComponent;
  let fixture: ComponentFixture<JornadaGolfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JornadaGolfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JornadaGolfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
