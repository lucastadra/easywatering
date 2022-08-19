import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigatorsChartsComponent } from './irrigators-charts.component';

describe('IrrigatorsChartsComponent', () => {
  let component: IrrigatorsChartsComponent;
  let fixture: ComponentFixture<IrrigatorsChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrigatorsChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrigatorsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
