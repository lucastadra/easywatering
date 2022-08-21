import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestRegisterComponent } from './harvest-register.component';

describe('RegisterComponent', () => {
  let component: HarvestRegisterComponent;
  let fixture: ComponentFixture<HarvestRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
