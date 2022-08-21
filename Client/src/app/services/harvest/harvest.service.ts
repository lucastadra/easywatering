import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class HarvestService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get('/api/harvest/', { });
  }
  
  getByHarvestId(harvestId: number | string): Observable<any> {
    return this.http.get(`/api/harvest/${harvestId}`, { });
  }

  deleteHarvest(harvestId: number | string): Observable<any> {
    return this.http.delete(`/api/harvest/${harvestId}`, { });
  }

  register(name: string, desc: string): Observable<any> {
    console.log("caiu aqui")
    return this.http.post('/api/harvest/', { name, desc });
  }
}
