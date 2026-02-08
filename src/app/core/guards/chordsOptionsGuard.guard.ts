import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { selectChordsAreGuessed } from '@app/application/chords/store/chords.selector';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChordsOptionsGuard implements CanActivate {
  private store = inject(Store);

  private allowedForOptions = this.store.pipe(select(selectChordsAreGuessed));
  private allowedForOptionsSubscription!: Subscription;
  private allowed!: boolean;
  private router = inject(Router);

  constructor() {
    this.allowedForOptionsSubscription = this.allowedForOptions.subscribe((state: boolean) => (this.allowed = state));
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (state.url === '/options' && !this.allowed) {
      this.router.navigate(['/']);
    }
    return true;
  }

  ngOnDestroy(): void {
    this.allowedForOptionsSubscription.unsubscribe();
  }
}
