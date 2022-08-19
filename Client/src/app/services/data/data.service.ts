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
  getDataByESP(espId: string): Observable<any> {
    return this.http.get(`/api/data/esp/${espId}`, {  });
  }
}
