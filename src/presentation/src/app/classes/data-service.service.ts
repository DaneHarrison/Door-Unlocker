import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class DataService {
  readonly BACKEND_URL = 'https://localhost:443'; 

  constructor(private http: HttpClient) {}


  getFriends(): any {
    return this.http.get(this.BACKEND_URL + '/getFriends/')
  }

  modAccess(userID: number) {
    return this.http.post(this.BACKEND_URL + '/modAccess/', { 'userID': userID }, { responseType: 'text' })
  }

  addFriend(name: String, email: String) {
    return this.http.post(this.BACKEND_URL + '/add/', {'name': name, 'email': email}, { responseType: 'text' })
  }

  deleteFriend(userID: number) {
    return this.http.post(this.BACKEND_URL + '/delete/', { 'userID': userID }, { responseType: 'text' })
  }

  requestlogin(email: string) {
    this.http.post(this.BACKEND_URL + '/login/requestToken/', { 'email': email }).subscribe(() => {})
  }

  logout() {
    this.http.get(this.BACKEND_URL + '/logout/').subscribe(() => {})
  }
}