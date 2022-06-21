import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroRaquetbolComponent } from './tablero-raquetbol.component';

describe('TableroRaquetbolComponent', () => {
  let component: TableroRaquetbolComponent;
  let fixture: ComponentFixture<TableroRaquetbolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroRaquetbolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroRaquetbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
