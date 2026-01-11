import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordCardComponent } from './chord-card.component';

describe('ChordCardComponent', () => {
  let component: ChordCardComponent;
  let fixture: ComponentFixture<ChordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
