import { Component, Input, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../Common/Services/Backend/api.service';
import { StorageService } from '../../../Common/Services/storage.service';
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { SnackBarService } from '../../../Common/Services/Ui/snack-bar.service';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from "@angular/material/badge";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { UserAccountComponent } from "../../user-account/user-account.component";

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule, MatButtonModule, RouterModule, AsyncPipe, FormsModule, MatBadgeModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css'
})
export class TopNavbarComponent implements OnInit {

  constructor(private apiServices: ApiService, private route: Router, private activatedRoute: ActivatedRoute) { }

  snackBar = inject(SnackBarService)
  storage = inject(StorageService)
  user: any
  quantity: any = 0
  placeHolder = "search products"

  title_search = ""

  ngOnInit(): void {
    this.getCartProducts()
  }

  async getCartProducts() {
    this.storage.getUser().subscribe((res: any): void => {
      if (res?.cart != null) {
        let cartProduct: any = {}

        Object.keys(res?.cart).forEach(id => {
          this.apiServices.getProduct(id).subscribe((product: any) => {
            
            product.quantity = res.cart[id];
            cartProduct[id] = product;

            this.storage.setCartProducts(cartProduct)
            this.storage.setQuantity(Object.values(res?.cart).reduce((last: any, curr: any) => last + curr, 0))
          });
        })
      }
    })
  }

  goBack() {
    this.title_search = ''
    // this.route.navigate(['../'])
  }

  async fillter(searchInput: any) {
    this.storage.getFillter().pipe(take(1)).subscribe((res: any) => {
      res.productName = searchInput.value
      // this.placeHolder = searchInput.value
      this.storage.setFillter(res)
      this.route.navigate(['products/search', searchInput.value])
      // searchInput.value = ''
      this.title_search = ''
    })

  }

  toggle() {
    this.storage.setSideNavtoggle()
  }

  navigateToOrders(){
    this.storage.getUser().pipe(take(1)).subscribe((res:any) => {
      if(res)
        this.route.navigate(['orders'])
      else
        this.route.navigate(['orderInfo'])
    })
  }
}
