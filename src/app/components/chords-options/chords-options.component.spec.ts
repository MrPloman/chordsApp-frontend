import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordsOptionsComponent } from './chords-options.component';

describe('ChordsOptionsComponent', () => {
  let component: ChordsOptionsComponent;
  let fixture: ComponentFixture<ChordsOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordsOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChordsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
