import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { StorageService } from '../../Common/Services/storage.service';
import { RestURL } from '../../Common/Constant/RestURL';
import { take } from 'rxjs';
import { CurrencyPipe, NgOptimizedImage, PercentPipe, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartComponent } from '../cart/cart.component';
import { signalSetFn } from '@angular/core/primitives/signals';
import { SnackBarService } from '../../Common/Services/Ui/snack-bar.service';
import { isNumberObject } from 'node:util/types';
import { _isNumberValue } from '@angular/cdk/coercion';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [MatBottomSheetModule, CurrencyPipe, PercentPipe, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit {

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private _bottomSheet: MatBottomSheet) { }

  storage: any = inject(StorageService)
  snackBar: any = inject(SnackBarService)

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((res: any) => {
      this.getProduct(res["id"])
    })

  }

  product: any = undefined
  img = RestURL.Path.getImage
  currentIndex: any = 1

  getProduct(productId: any) {

    this.apiService.getProduct(productId).subscribe((res => {
      this.product = res
    }))

  }

  @ViewChild('sliderContainer') sliderContainer: ElementRef | undefined

  onScroll() {
    const containerWidth = this.sliderContainer?.nativeElement.offsetWidth
    const scrollX = this.sliderContainer?.nativeElement.scrollLeft
    const index = Math.round(scrollX / containerWidth)
    this.currentIndex = index + 1

  }

  addToCart(product: any) {

    this.storage.getCartProducts().pipe(take(1)).subscribe((res: any) => {

      this.storage.getQuantity().pipe(take(1)).subscribe((res: any) => {
        this.storage.setQuantity(res + 1)
      })

      if (res[product.productId]) {
        product = res[product.productId]
        product.quantity += 1
      }
      else
        product.quantity = 1

      res[product.productId] = product

      let val: any = {}
      Object.keys(res).forEach(key => {
        val[key] = res[key].quantity
      })

      
      this.storage.setCartProducts(res)

      this.storage.getUser().pipe(take(1)).subscribe((res:any) => {
        if(res) this.apiService?.addToCart(val)?.subscribe((res:any)=>{
          this.snackBar.successSnackBar("Successfully added to Cart")
        })
        else this.snackBar.successSnackBar("Successfully added to Cart")
      })
    })


  }

  placeOrder(product: any) {
    localStorage.setItem("orderProduct", JSON.stringify({ [product.productId]: 1 }))
    this.storage.setPrice(product.productSellingPrice)
  }




}
