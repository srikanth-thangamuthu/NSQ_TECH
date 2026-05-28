import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private http: HttpClient) {}

  getRecords() {
  return this.http.get<any[]>(
    'https://nsq-tech-backend.onrender.com/records?t='
  );
}
}