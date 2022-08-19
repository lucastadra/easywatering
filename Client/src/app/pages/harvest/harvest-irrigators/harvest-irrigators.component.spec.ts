import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestIrrigatorsComponent } from './harvest-irrigators.component';

describe('HarvestIrrigatorsComponent', () => {
  let component: HarvestIrrigatorsComponent;
  let fixture: ComponentFixture<HarvestIrrigatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestIrrigatorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestIrrigatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
