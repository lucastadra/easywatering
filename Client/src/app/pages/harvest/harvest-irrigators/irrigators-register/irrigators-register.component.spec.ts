import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigatorsRegisterComponent } from './irrigators-register.component';

describe('RegisterComponent', () => {
  let component: IrrigatorsRegisterComponent;
  let fixture: ComponentFixture<IrrigatorsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IrrigatorsRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IrrigatorsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
