import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDataComponent } from './board-data.component';

describe('BoardDataComponent', () => {
  let component: BoardDataComponent;
  let fixture: ComponentFixture<BoardDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
