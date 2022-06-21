import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaGolfComponent } from './categoria-golf.component';

describe('CategoriaGolfComponent', () => {
  let component: CategoriaGolfComponent;
  let fixture: ComponentFixture<CategoriaGolfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaGolfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaGolfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
