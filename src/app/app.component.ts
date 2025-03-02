import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [MatSliderModule, FormsModule],
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
  public sound() {
    const audio = new Audio(this.soundSrc);
    audio.load();
    audio.play();
  }
  constructor() {}
}
