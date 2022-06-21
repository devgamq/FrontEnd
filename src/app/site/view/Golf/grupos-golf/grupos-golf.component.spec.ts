import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposGolfComponent } from './grupos-golf.component';

describe('GruposGolfComponent', () => {
  let component: GruposGolfComponent;
  let fixture: ComponentFixture<GruposGolfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposGolfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposGolfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
