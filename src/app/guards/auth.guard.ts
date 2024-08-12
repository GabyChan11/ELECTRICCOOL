import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseService = inject(FirebaseService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let user = localStorage.getItem('user');

    return new Promise((resolve) => {
      this.firebaseService.gethAuth().onAuthStateChanged((auth) => {
        if (auth) {
          if (user) resolve(true);
        } else {
          this.firebaseService.signOut();
          resolve(false);
        }
      })
    })
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};