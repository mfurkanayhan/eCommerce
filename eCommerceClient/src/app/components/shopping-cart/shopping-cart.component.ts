import { Component, OnInit } from '@angular/core';
import { TrCurrencyPipe } from 'tr-currency';
import { ShoppingCartModel } from '../../models/shopping-cart.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { AuthService } from '../../services/auth.service';
import { api } from '../../constants/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ErrorService } from '../../services/error.service';
import { MessageService } from 'primeng/api';
import { SwalService } from '../../services/swal.service'


@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [TrCurrencyPipe, ToastModule, ButtonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
  carts: ShoppingCartModel[] = [];
  sum: number = 0;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    public _cart: ShoppingCartService,

    private swal: SwalService,
    private error: ErrorService,
    private primeng: MessageService
  ) {} // Constructor Method => The first method that runs when the class is called

  ngOnInit(): void { }

  decrement(cart: ShoppingCartModel) {
    if (cart.quantity === 1) {
      const response = confirm("Do you want to remove the item from the cart?")
      if (response) {
        this._cart.decrement(cart.productId);
      }
    }else{
      this._cart.decrement(cart.productId);
    }
  }

  remove(id: number) {
    const response = confirm("Do you want to remove the item from the cart?")
    if (response) {
      this.http.get(`${api}/ShoppingCarts/RemoveById?id=${id}`, {
        headers: {
          "Authorization": "Bearer " + this.auth.token
        }
      })
      .subscribe({
        next: ()=> {
          this._cart.getAll();
        },
        error: (err: HttpErrorResponse)=> {
          console.log(err);
        }
      })
    }
  }

  pay(){
    const response = confirm("Do you want to make the payment?");
    if(response){
      this.http.get(`${api}/ShoppingCarts/Pay`, {
        headers: {
          "Authorization": "Bearer " + this.auth.token
        }
      })
      .subscribe({
        next: ()=> {
          this._cart.getAll();
        },
        error: (err: HttpErrorResponse)=> {
          console.log(err);
        }
      })
    }
  }
}