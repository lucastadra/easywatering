import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigatorsDataComponent } from './irrigators-data.component';

describe('IrrigatorsDataComponent', () => {
  let component: IrrigatorsDataComponent;
  let fixture: ComponentFixture<IrrigatorsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrigatorsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrigatorsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
