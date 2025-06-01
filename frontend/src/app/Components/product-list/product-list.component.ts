import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { StorageService } from '../../Common/Services/storage.service';
import { RestURL } from '../../Common/Constant/RestURL';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UpperCasePipe,CurrencyPipe,PercentPipe, NgOptimizedImage, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FillterNavBarComponent } from '../NavBar/fillter-nav-bar/fillter-nav-bar.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterModule,UpperCasePipe,PercentPipe,MatButtonModule,FillterNavBarComponent,NgOptimizedImage, DecimalPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  constructor(private apiServices: ApiService, private rout: Router, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.activatedRoute?.params?.subscribe((res: any) => {
      if(res["searchValue"])
        this.getFillterValue(res["searchValue"])

      else
        this.getFillterValue("")
    })

  }

  products: any
  imgURL:String = RestURL.Path.getImage
  public storageService = inject(StorageService)

  getProduct(item: any):void {
    this.rout.navigate(["products", item.id])
  }

  getProducts():void {
      this.apiServices.getAllProduct().subscribe((res: any) => {
        this.products = res                
      })
  }

  getFillterValue(searchValue:any):void  {
    this.storageService.getFillter().subscribe((res: any) => {            
      if (res)
        res.productName = searchValue
      
      if(!res.productCategory)
        res.productCategory = ""

        this.apiServices.getFillteredProduct(res).subscribe((res: any) => {
          this.products = res
        })
    })
  }

}
