import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelViewComponent } from './solar-panel-view.component';

describe('SolarPanelViewComponent', () => {
  let component: SolarPanelViewComponent;
  let fixture: ComponentFixture<SolarPanelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
