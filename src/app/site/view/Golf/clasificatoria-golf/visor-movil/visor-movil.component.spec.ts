import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorMovilComponent } from './visor-movil.component';

describe('VisorMovilComponent', () => {
  let component: VisorMovilComponent;
  let fixture: ComponentFixture<VisorMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
