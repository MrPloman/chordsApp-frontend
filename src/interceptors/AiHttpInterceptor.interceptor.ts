import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/internal/operators/tap';
export const AIHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        snackBar.open(error.message, 'close', {
          duration: 5000,
        });
      },
    })
  );
};
