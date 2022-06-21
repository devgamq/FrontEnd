import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeyendaColorComponent } from './leyenda-color.component';

describe('LeyendaColorComponent', () => {
  let component: LeyendaColorComponent;
  let fixture: ComponentFixture<LeyendaColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeyendaColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeyendaColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
