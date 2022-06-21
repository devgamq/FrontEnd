import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionTipoComponent } from './acreditacion-tipo.component';

describe('AcreditacionTipoComponent', () => {
  let component: AcreditacionTipoComponent;
  let fixture: ComponentFixture<AcreditacionTipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcreditacionTipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcreditacionTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
