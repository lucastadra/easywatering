import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get('/api/esp/', { });
  }
  
  getByEspId(espId: number | string): Observable<any> {
    return this.http.get(`/api/esp/${espId}`, { });
  }

  getByHarvestId(harvestId: number | string): Observable<any> {
    return this.http.get(`/api/esp/harvest/${harvestId}`, { });
  }

}
