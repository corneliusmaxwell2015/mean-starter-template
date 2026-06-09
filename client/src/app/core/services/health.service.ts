import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  checkHealth() {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
