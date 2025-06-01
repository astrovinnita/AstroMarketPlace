import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../Common/Services/storage.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: any
  private apiServices = inject(ApiService)
  private storage = inject(StorageService)

  ngOnInit(): void {
    this.storage.getOrderId().subscribe(res => {if(res) this.getOrderInfo(res)})
  }

  getOrderInfo(orderId: any) {
    if(orderId) this.apiServices.getOrderInfo(orderId).subscribe(res => this.orders = res )
  }

}
