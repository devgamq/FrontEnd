import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeyendaColorMovilComponent } from './leyenda-color-movil.component';

describe('LeyendaColorMovilComponent', () => {
  let component: LeyendaColorMovilComponent;
  let fixture: ComponentFixture<LeyendaColorMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeyendaColorMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeyendaColorMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
