import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalleroComponent } from './medallero.component';

describe('MedalleroComponent', () => {
  let component: MedalleroComponent;
  let fixture: ComponentFixture<MedalleroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedalleroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedalleroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
