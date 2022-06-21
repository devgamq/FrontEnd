import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlVisorComponent } from './control-visor.component';

describe('ControlVisorComponent', () => {
  let component: ControlVisorComponent;
  let fixture: ComponentFixture<ControlVisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlVisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlVisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
