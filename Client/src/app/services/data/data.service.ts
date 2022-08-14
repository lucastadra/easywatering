import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}
  
  getDataById(dataId: number | string): Observable<any> {
    return this.http.post(`/api/data/${dataId}`, { responseType: 'text' });
  }
  getDataByESP(): Observable<any> {
    return this.http.get('/api/data/esp/' + '6f9629a8-8827-44d2-94ed-cad4b6fe9154', {  });
  }
}
