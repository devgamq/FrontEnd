import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificatoriaGolfComponent } from './clasificatoria-golf.component';

describe('ClasificatoriaGolfComponent', () => {
  let component: ClasificatoriaGolfComponent;
  let fixture: ComponentFixture<ClasificatoriaGolfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasificatoriaGolfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificatoriaGolfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
