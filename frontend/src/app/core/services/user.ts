import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(`${this.apiUrl}?t=${Date.now()}`);
  }

  addUser(user: any) {
    return this.http.post<any>(this.apiUrl, user);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  updateUser(id: number, user: any) {
  return this.http.put<any>(
    `${this.apiUrl}/${id}`,
    user
  );
}
}

