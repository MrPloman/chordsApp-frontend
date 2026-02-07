import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordsHandbookComponent } from './chords-handbook.component';

describe('ChordsHandbookComponent', () => {
  let component: ChordsHandbookComponent;
  let fixture: ComponentFixture<ChordsHandbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordsHandbookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChordsHandbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
