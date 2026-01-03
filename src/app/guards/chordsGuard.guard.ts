import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  createUrlTreeFromSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Chord } from '@app/models/chord.model';
import { checkIfChordsAreGuessed } from '@app/services/chordsService.service';
import { selectChordGuesserState } from '@app/store/selectors/chords.selector';
import { IChordsGuesserState } from '@app/store/state/chords.state';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChordsGuard implements CanActivate {
  private checkChords = checkIfChordsAreGuessed;
  private store = inject(Store);
  private chords: Chord[] = [];
  private chordsStore: Observable<any> = new Observable();
  private chordsStoreSubscription: Subscription = new Subscription();
  private router = inject(Router);

  constructor() {
    this.chordsStore = this.store.pipe(select(selectChordGuesserState));
    this.chordsStoreSubscription = this.chordsStore.subscribe(
      (chordsState: IChordsGuesserState) => {
        this.chords = chordsState.currentChords
          ? chordsState.currentChords
          : [];
      }
    );
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      (state.url === '/options' || state.url === '/progression') &&
      !this.checkChords(this.chords)
    ) {
      this.router.navigate(['/']);
    }
    return true;
  }
  ngOnDestroy(): void {
    this.chordsStoreSubscription.unsubscribe();
  }
}
