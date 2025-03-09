import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { FretboardComponent } from './components/fretboard/fretboard.component';
import { FunctionSelectorComponent } from './components/function-selector/function-selector.component';

@Component({
  selector: 'app-root',
  imports: [
    MatSliderModule,
    FormsModule,
    FretboardComponent,
    FunctionSelectorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chordsApp-frontend';

  soundSrc = './assets/audios/A5/A5_0_A.mp3';

  onVolumeChange(event: any) {
    // Use the updated volume value as needed (e.g., set audio volume)
  }
  ngOnInit(): void {}
}
