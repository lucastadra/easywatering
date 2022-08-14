import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
@Injectable()

export class AuthGuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): boolean {

    console.log("Expirado?: ", !this.authService.isTokenExpired())
    if (!this.authService.isTokenExpired()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}