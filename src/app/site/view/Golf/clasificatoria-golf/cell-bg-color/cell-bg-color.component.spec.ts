import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellBgColorComponent } from './cell-bg-color.component';

describe('CellBgColorComponent', () => {
  let component: CellBgColorComponent;
  let fixture: ComponentFixture<CellBgColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellBgColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellBgColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
