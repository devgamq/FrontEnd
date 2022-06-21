import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegiosAcreditacionComponent } from './privilegios-acreditacion.component';

describe('PrivilegiosAcreditacionComponent', () => {
  let component: PrivilegiosAcreditacionComponent;
  let fixture: ComponentFixture<PrivilegiosAcreditacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivilegiosAcreditacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegiosAcreditacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
