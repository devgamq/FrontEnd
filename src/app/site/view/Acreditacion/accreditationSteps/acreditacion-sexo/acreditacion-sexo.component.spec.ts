import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionSexoComponent } from './acreditacion-sexo.component';

describe('AcreditacionSexoComponent', () => {
  let component: AcreditacionSexoComponent;
  let fixture: ComponentFixture<AcreditacionSexoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcreditacionSexoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcreditacionSexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
