import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetidorGolfComponent } from './competidor-golf.component';

describe('CompetidorGolfComponent', () => {
  let component: CompetidorGolfComponent;
  let fixture: ComponentFixture<CompetidorGolfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetidorGolfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetidorGolfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
