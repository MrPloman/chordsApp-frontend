import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputInstructionComponent } from './input-instruction.component';

describe('InputInstructionComponent', () => {
  let component: InputInstructionComponent;
  let fixture: ComponentFixture<InputInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputInstructionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
