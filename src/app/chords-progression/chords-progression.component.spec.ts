import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordsProgressionComponent } from './chords-progression.component';

describe('ChordsProgressionComponent', () => {
  let component: ChordsProgressionComponent;
  let fixture: ComponentFixture<ChordsProgressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordsProgressionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChordsProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
