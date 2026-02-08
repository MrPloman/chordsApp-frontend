import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { selectAllowedForProgression } from '@app/application/chords/store/chords.selector';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChordsProgressionGuard implements CanActivate {
  private store = inject(Store);

  private allowedForProgression = this.store.pipe(select(selectAllowedForProgression));
  private allowedForProgressionSubscription!: Subscription;
  private allowed!: boolean;
  private router = inject(Router);

  constructor() {
    this.allowedForProgressionSubscription = this.allowedForProgression.subscribe(
      (state: boolean) => (this.allowed = state)
    );
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (state.url === '/progression' && !this.allowed) {
      this.router.navigate(['/']);
    }
    return true;
  }

  ngOnDestroy(): void {
    this.allowedForProgressionSubscription.unsubscribe();
  }
}
