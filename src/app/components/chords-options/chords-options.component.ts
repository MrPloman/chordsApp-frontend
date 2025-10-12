import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChordsGridComponent } from '../chords-grid/chords-grid.component';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { Chord } from '@app/models/chord.model';
import { minimumChordsToMakeProgression } from '@app/config/global_variables/rules';
import { areEveryChordsValid } from '@app/services/chordsService.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chords-options',
  imports: [
    CommonModule,
    SubmitButtonComponent,
    ChordsGridComponent,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './chords-options.component.html',
  styleUrl: './chords-options.component.scss',
})
export class ChordsOptionsComponent {
  public loading: boolean = true;
  public chords: Chord[] = [];
  public chordSelected: number = 0;
  public message: string = '';

  public validChords = areEveryChordsValid;
  public minimumChordsToMakeProgression = minimumChordsToMakeProgression;

  public setOtherChordOption() {}
}
