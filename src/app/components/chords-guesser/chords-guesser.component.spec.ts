import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordsGuesserComponent } from './chords-guesser.component';

describe('ChordsGuesserComponent', () => {
  let component: ChordsGuesserComponent;
  let fixture: ComponentFixture<ChordsGuesserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordsGuesserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChordsGuesserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
