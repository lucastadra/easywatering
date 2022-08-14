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
}
