import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShoppingCartModel } from '../models/shopping-cart.model';
import { AuthService } from './auth.service';
import { api } from '../constants/api';
import { ErrorService } from './error.service';
import { SwalService } from './swal.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  sum: number = 0;
  carts: ShoppingCartModel[] = [];

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private swal: SwalService,
    private primeng: MessageService,
    private error: ErrorService) {

    this.auth.currentUser.subscribe(user => {
      if (user) {
        this.getAll();
      } else {
        this.clearCart();
      }
    });
  }

  getAll() {
    this.http.get(`${api}/ShoppingCarts/GetAll`, {
      headers: {
        "Authorization": "Bearer " + this.auth.token
      }
    })
      .subscribe({
        next: (res: any) => {
          this.carts = res;
          this.calculateSum();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      });
  }

  calculateSum() {
    this.sum = 0;
    for (const cart of this.carts) {
      this.sum += cart.quantity * cart.product.price;
    }
  }

  clearCart() {
    this.carts = [];
    this.sum = 0;
  }

  increment(productId: number) {
    this.http.get(`${api}/ShoppingCarts/Increment?productId=${productId}`, {
      headers: {
        "Authorization": "Bearer " + this.auth.token
      }
    })
      .subscribe({
        next: () => {
          this.getAll();
          this.primeng.add({ severity: "success", summary: "Success", detail: "Product added to cart successfully" });
        },
        error: (err: HttpErrorResponse) => {
          this.error.errorHandler(err);
        }
      });
  }

  decrement(productId: number) {
    this.http.get(`${api}/ShoppingCarts/Decrement?productId=${productId}`, {
      headers: {
        "Authorization": "Bearer " + this.auth.token
      }
    })
      .subscribe({
        next: () => {
          this.getAll();
          this.primeng.add({ severity: "warn", summary: "Success", detail: "Product removed from cart successfully" });
          //this.swal.toast('Product removed from cart successfully', 'info');
        },
        error: (err: HttpErrorResponse) => {
          this.error.errorHandler(err);
        }
      });
  }
}
