import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient, 
    private storageService: StorageService
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post('/api/auth/signin', { email, password });
  }

  register(full_name: string, email: string, password: string): Observable<any> {
    return this.http.post(
      '/api/signup',
      {
        full_name,
        email,
        password,
      },
      
    );
  }

  logout(): Observable<any> {
    return this.http.post('/api/auth/signout', { }, httpOptions);
  }


  public isTokenExpired(): boolean {
    const token = this.storageService.getAuthorizationToken();

    console.log("Token: ", token);
    if (!token) {
      return false;
    }

    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelperService.isTokenExpired(token);
  }
}
