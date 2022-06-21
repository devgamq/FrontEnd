import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegacionDropdownComponent } from './delegacion-dropdown.component';

describe('DelegacionDropdownComponent', () => {
  let component: DelegacionDropdownComponent;
  let fixture: ComponentFixture<DelegacionDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelegacionDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegacionDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
