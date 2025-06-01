import { Component, Inject, Optional, inject } from '@angular/core';
import { RestURL } from '../../Common/Constant/RestURL';
import { StorageService } from '../../Common/Services/storage.service';
import { take } from 'rxjs';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ApiService } from '../../Common/Services/Backend/api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, MatDividerModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, MatCardModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  quantity = [1, 2, 3]
  totalQuantity: any = 0
  totalPricce: any = 0

  products: any

  cartProduct: any = {}

  img = RestURL.Path.getImage
  private storage = inject(StorageService)
  private apiServices = inject(ApiService)
  private rout = inject(Router)

  constructor(@Optional() @Inject(MatBottomSheetRef) private bottomSheetRef: MatBottomSheetRef<CartComponent>) { }

  ngOnInit(): void {
    this.addProducts()
    if(this.storage.getToken()) this.getCart()
  }

  private getCart() {
    const query = `
      query GetUser {
          getUser {
            cartItem
          }
        }`;

    this.apiServices.getUser(query).subscribe((res: any) => {
      this.storage.getUser().pipe((take(1))).subscribe((user:any) => {
        user.cart = res.cart
        this.storage.setUser(user)
      })
    })
  }

  async updateValue(val: any, operator: any) {

    if (val.quantity == "") val.quantity = 0

    switch (operator) {

      case ('+'):
        val.quantity = parseInt(val.quantity) + 1
        break;

      case ('-'):
        val.quantity = parseInt(val.quantity) - 1
        break

    }

    this.onInputChange()
    this.apiServices?.addToCart(this.cartProduct)?.subscribe()

  }

  addProducts() {
    this.storage.getCartProducts().subscribe((res: any) => {
      if (res) this.products = Object.values(res)
      this.onInputChange()
    })
  }

  async removeFromCart(product: any) {
    this.products.splice(this.products.indexOf(product), 1)
    delete this.cartProduct[product.productId]

    this.apiServices?.addToCart(this.cartProduct)?.subscribe()

    this.storage.getCartProducts().pipe(take(1)).subscribe(res => delete res[product.productId])

    this.onInputChange()
  }

  onInputChange() {

    this.totalPricce = 0
    this.totalQuantity = 0

    this.products.forEach((p: any) => {

      if (!this.quantity.includes(p.quantity) && p.quantity != undefined) this.quantity.push(p.quantity)

      if (p.quantity != undefined) {
        this.totalQuantity += p.quantity

        this.totalPricce += p.productSellingPrice * p.quantity

        this.quantity.sort()

        this.cartProduct[p.productId] = p.quantity

      }

    });

    this.storage.setQuantity(this.totalQuantity)
    this.storage.setPrice(this.totalPricce)

  }

  placeOrder() {
    localStorage.setItem("orderProduct", JSON.stringify(this.cartProduct))
    this.rout.navigate(['checkout'])
    this.bottomSheetRef.dismiss();
  }

  startShoping() {
    this.rout.navigate(['products'])
  }

}
