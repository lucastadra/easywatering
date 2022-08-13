import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post('/api/auth/signin', { email, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      '/api/signup',
      {
        username,
        email,
        password,
      },
      
    );
  }

  logout(): Observable<any> {
    return this.http.post('/api/auth/signout', { }, httpOptions);
  }
}
