import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { selectChordState } from '@app/application/chords/store/chords.selector';
import { ChordsState } from '@app/application/chords/store/chords.state';
import { Chord } from '@app/domain/chords/models/chord.model';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChordsGuard implements CanActivate {
  private store = inject(Store);
  private chords: Chord[] = [];
  private chordsStore: Observable<any> = new Observable();
  private chordsStoreSubscription: Subscription = new Subscription();
  private router = inject(Router);

  constructor() {
    this.chordsStore = this.store.pipe(select(selectChordState));
    this.chordsStoreSubscription = this.chordsStore.subscribe((chordsState: ChordsState) => {
      this.chords = chordsState.currentChords ? chordsState.currentChords : [];
    });
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (
      state.url === '/options' ||
      state.url === '/progression'
      // &&
      // !chordsHelper.checkIfChordsAreGuessed(this.chords)
    ) {
      this.router.navigate(['/']);
    }
    return true;
  }

  ngOnDestroy(): void {
    this.chordsStoreSubscription.unsubscribe();
  }
}
