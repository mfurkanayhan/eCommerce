import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginResponseModel } from '../models/login-response.model';
import { jwtDecode } from 'jwt-decode';
import { DecodeModel } from '../models/decode.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  hasAuthenticated: boolean = false;
  decode: DecodeModel = new DecodeModel();
  token: string = "";

  constructor() {
    this.isAuthenticated();
  }

  isAuthenticated() {
    const responseString = localStorage.getItem("response");
    if (responseString) {
      try {
        const response = JSON.parse(responseString) as LoginResponseModel;
        this.token = response?.accessToken;
        this.decode = jwtDecode(this.token);

        const now = new Date().getTime() / 1000;

        if (now > this.decode.exp) {
          this.hasAuthenticated = false;
          this.currentUserSubject.next(null);
          return false;
        }

        this.hasAuthenticated = true;
        this.currentUserSubject.next(response);
        return true;
      } catch (error) {
        console.log(error);
        this.hasAuthenticated = false;
        this.currentUserSubject.next(null);
        return false;
      }
    }

    this.hasAuthenticated = false;
    this.currentUserSubject.next(null);
    return false;
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  logout() {
    localStorage.removeItem("response");
    this.token = "";
    this.hasAuthenticated = false;
    this.currentUserSubject.next(null);
  }
}
