import { Component } from '@angular/core';
import { provideStore, StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-function-selector',
  imports: [BrowserModule],

  templateUrl: './function-selector.component.html',
  styleUrl: './function-selector.component.scss',
})
export class FunctionSelectorComponent {}
