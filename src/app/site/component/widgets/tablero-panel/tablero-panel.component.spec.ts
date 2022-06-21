import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroPanelComponent } from './tablero-panel.component';

describe('TableroPanelComponent', () => {
  let component: TableroPanelComponent;
  let fixture: ComponentFixture<TableroPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableroPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableroPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
