import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronometroPanelComponent } from './cronometro-panel.component';

describe('CronometroPanelComponent', () => {
  let component: CronometroPanelComponent;
  let fixture: ComponentFixture<CronometroPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronometroPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronometroPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
