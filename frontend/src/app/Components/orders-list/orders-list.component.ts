import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../Common/Services/storage.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent implements OnInit {

  private storage = inject(StorageService)
  private apiServices = inject(ApiService)
  private route = inject(Router)
  orders:any

  ngOnInit(): void {
    if(this.storage.getToken()) this.getOrders()
  }

  getOrders(){
    const query = `
    query GetUser {
        getUser {
          ordersString
          orders {
            orderId
            createdDate
            paymentStatus
            deliveryStatus
          }
        }
      }`;

  this.apiServices.getUser(query).subscribe((res: any) => {
    this.storage.getUser().pipe(take(1)).subscribe((user:any) => {      
      user.orders = res?.orders     
      this.orders = res?.orders
      this.storage.setUser(user)
     })
  })
  }


  getOrderInfo(orderId:any){

    this.storage.setOrderId(orderId)
    this.route.navigate(['orderInfo'])

  }


}
