import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http:HttpClient,@Inject(PLATFORM_ID) private platformId: Object) { }

  getToken(): any {        

    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token");
    }
    return null;
  }

  setToken(token:any) {
    localStorage.setItem("token", token)
  }

  private fillterSubject = new BehaviorSubject({});
  private cartProductsSubject = new BehaviorSubject<any>({});
  private quantitySubject = new BehaviorSubject<any>(0);
  private priceSubject = new BehaviorSubject<any>(0);
  private userSubject = new BehaviorSubject<any>({undefined});
  private SideNavtoggle = new Subject<any>() 
  private orderId = new BehaviorSubject<any>(undefined)
  private deliveryInfo = new BehaviorSubject<any>(undefined)


  setFillter(fillter:any){
    this.fillterSubject.next(fillter)
  }

  getFillter(){
    return this.fillterSubject.pipe()
  }

  setCartProducts(product:any){
    this.cartProductsSubject.next(product)
  }

  getCartProducts(){
    return this.cartProductsSubject.pipe()
  }

  setQuantity(quantity:any){
    this.quantitySubject.next(quantity)
  }

  getQuantity(){
    return this.quantitySubject.pipe();
  }

  setPrice(price:any){
    this.priceSubject.next(price)
  }

  getPrice(){
    return this.priceSubject.pipe();
  }

  setUser(user:any){
    this.userSubject.next(user)
  }

  getUser(){
    return this.userSubject.pipe();
  }

  setSideNavtoggle(){
    this.SideNavtoggle.next(true)
  }

  getSideNavtoggle(){
    return this.SideNavtoggle.pipe()
  }

  setOrderId(orderId:any){
    this.orderId.next(orderId)
  }

  getOrderId(){
    return this.orderId.pipe()
  }

  setDeliveryInfo(deliveryInfo:any){
    this.deliveryInfo.next(deliveryInfo)
  }

  getDeliveryInfo(){
    return this.deliveryInfo.pipe()
  }

}
