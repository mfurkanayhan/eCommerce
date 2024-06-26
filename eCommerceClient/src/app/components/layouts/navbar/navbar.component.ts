import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ShoppingCartService } from '../../../services/shopping-cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public cart: ShoppingCartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.currentUser.subscribe(user => {
      if (!user) {
        this.router.navigateByUrl("/");
      }
    });
  }

  calculateShoppingCartsQuantity() {
    let totalQuantity = 0;
    for (let c of this.cart.carts) {
      totalQuantity += c.quantity;
    }

    return totalQuantity;
  }

  logout() {
    this.auth.logout();
    this.cart.clearCart();
  }
}
