import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardAnalyticsService {
  constructor(private http: HttpClient) {}

  getConfig(period:string,symbol:string,periodDesc:string) {
    return this.http.get<any>(`https://www.alphavantage.co/query?function=${periodDesc}&symbol=${symbol}&interval=${period}&apikey=BTOLVBSWL344UQJP`);
  }
}
