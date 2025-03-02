import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chordsApp-frontend';

  soundSrc = './assets/audios/A5/A5_0_A.mp3';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  public sound() {
    const audio = new Audio(this.soundSrc);
    audio.load();
    audio.play();
  }
  constructor() {}
}
