import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RestURL } from '../../Constant/RestURL';
import { StorageService } from '../storage.service';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpServices: HttpService, private apollo:Apollo) { }

  private storage = inject(StorageService)

  getUser(query:any):any {

    const body = { query }
    
    if(this.storage.getToken())
    return this.httpServices.post(RestURL.Path.graphQuery, body, RestURL.ResponseType.JSON).pipe(map((res:any) => {      
      if(res?.data?.getUser?.cartItem) res.data.getUser.cart = JSON.parse(res?.data?.getUser?.cartItem)
      if(res.data.getUser.ordersString) res.data.getUser.orders = JSON.parse(res.data.getUser.ordersString)

      res = res.data.getUser      

      return res
    }))
  }

  getAllProduct() {
    return this.httpServices.get(RestURL.Path.getAllProduct)
  }

  getProduct(productId: any) {
    return this.httpServices.get(RestURL.Path.getProduct + productId)
  }

  getProductCategories() {
    return this.httpServices.get(RestURL.Path.getCategories)
  }

  getFillteredProduct(fillterValue: any) {
    return this.httpServices.post(RestURL.Path.getFilltered, fillterValue)
  }

  placeOrder(order: any) {
    return this.httpServices.post(RestURL.Path.placeOrder, order)
  }

  getPayment(orderInfo: any) {
    return this.httpServices.post(RestURL.Path.getPayment, orderInfo)
  }

  getOrderInfo(orderId: any) {
    return this.httpServices.get(RestURL.Path.getOrderInfo + orderId)
  }

  // ----------------------------- User ------------------------------------

  login(email: any) {
    return this.httpServices.post(RestURL.Path.login, email, RestURL.ResponseType.TEXT)
  }

  getToken(val: any) {
    return this.httpServices.post(RestURL.Path.getToken, val, RestURL.ResponseType.TEXT)
  }

  updateUserInfo(val: any):any {
    return this.httpServices.post(RestURL.Path.updateUser, val, RestURL.ResponseType.JSON)
}

  addToCart(val: any):any {
    if (this.storage.getToken())
      return this.httpServices.post(RestURL.Path.addToCart, val, RestURL.ResponseType.TEXT)
  }

  updateDeliveryInfo(val: any):any {
      return this.httpServices.post(RestURL.Path.updateDeliveryInfo, val, RestURL.ResponseType.JSON)
  }

  deleteDeliveryInfo(id: any):any {
      return this.httpServices.delete(RestURL.Path.deleteDeliveryInfo+id, RestURL.ResponseType.TEXT)
  }

  // -------------------------------------------- Seller --------------------------------------

  addProduct(productImages:any, productInfo:any):any{
    const formData = new FormData();
    Array.from(productImages).forEach((image:any)=>formData.append('productImages', image))

    formData.append('productInfo', JSON.stringify(productInfo));
    return this.httpServices.post(RestURL.Path.addProduct, formData)
  }

}
