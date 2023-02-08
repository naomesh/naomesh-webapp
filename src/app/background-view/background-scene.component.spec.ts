import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSceneComponent } from './background-scene.component';

describe('BackgroundSceneComponent', () => {
  let component: BackgroundSceneComponent;
  let fixture: ComponentFixture<BackgroundSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundSceneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
