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

  register(alias: string, harvest_id: number | string): Observable<any> {
    return this.http.post('/api/esp/', { alias, harvest_id });
  }

  delete(espId: number | string): Observable<any> {
    return this.http.delete(`/api/esp/${espId}`, { });
  }

  changePumpState(espId: string): Observable<any> {
    var mqttData = {
      topic: `easywatering/pump/${espId}`,
      message: "ON"
    }

    return this.http.post('/api/mqtt/pub', { topic: mqttData.topic, message: mqttData.message });
  }
}
