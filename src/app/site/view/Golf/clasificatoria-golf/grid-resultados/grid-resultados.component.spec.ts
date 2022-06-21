import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridResultadosComponent } from './grid-resultados.component';

describe('GridResultadosComponent', () => {
  let component: GridResultadosComponent;
  let fixture: ComponentFixture<GridResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridResultadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
