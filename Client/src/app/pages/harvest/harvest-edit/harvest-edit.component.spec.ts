import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestEditComponent } from './harvest-edit.component';

describe('RegisterComponent', () => {
  let component: HarvestEditComponent;
  let fixture: ComponentFixture<HarvestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
