import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Chord } from '@app/models/chord.model';
import { checkIfChordsAreGuessed } from '@app/services/chordsService.service';
import { selectChordState } from '@app/store/selectors/chords.selector';
import { ChordsState } from '@app/store/state/chords.state';
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
    this.chordsStore = this.store.pipe(select(selectChordState));
    this.chordsStoreSubscription = this.chordsStore.subscribe((chordsState: ChordsState) => {
      this.chords = chordsState.currentChords ? chordsState.currentChords : [];
    });
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if ((state.url === '/options' || state.url === '/progression') && !this.checkChords(this.chords)) {
      this.router.navigate(['/']);
    }
    return true;
  }
  ngOnDestroy(): void {
    this.chordsStoreSubscription.unsubscribe();
  }
}
