import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridClasificatorioComponent } from './grid-clasificatorio.component';

describe('GridClasificatorioComponent', () => {
  let component: GridClasificatorioComponent;
  let fixture: ComponentFixture<GridClasificatorioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridClasificatorioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridClasificatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
