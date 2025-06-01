import { Component, inject, NgZone } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { StorageService } from '../../Common/Services/storage.service';
import { Observable, map, startWith, take } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../../Common/Services/Ui/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var Razorpay: any
@Component({
  selector: 'app-delivery-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    CurrencyPipe,
    MatIconModule,
    AsyncPipe,
    MatDividerModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './delivery-form.component.html',
  styleUrl: './delivery-form.component.css'
})
export class DeliveryFormComponent {

  states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal'
  ]

  mobilePattern = /^[789]\d{9}$/

  constructor(private formBuilder: FormBuilder,private ngZone: NgZone, private apiServices: ApiService, private rout:Router, private activeRout:ActivatedRoute) { }

  private storage = inject(StorageService)
  private snackBar = inject(SnackBarService)


  orderAddress:any = this.formBuilder.record({
    deliveryId:null,
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    mobileNumber1: [, [Validators.required, Validators.pattern(this.mobilePattern)]],
    mobileNumber2: [, Validators.pattern(this.mobilePattern)],
    emailAddress: [, Validators.required],
    address: this.formBuilder.record({
      address1: ['', Validators.required],
      address2: [''],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      pinCode: [, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
  })

  filteredOptions: Observable<any[]> | undefined;
  orders: any
  totalPrice: any = this.storage.getPrice()
  isCheckout = false
  deliveryInformation:any = undefined
  buttonName:any = "Add Address"

  ngOnInit(): void {

    this.filteredOptions = this.orderAddress.get('address')?.get('state')?.valueChanges.pipe(startWith(''), map(value => this._filter(value || '')))

    this.orders = localStorage.getItem("orderProduct") 
    
    if(this.rout.url == '/addAddress'){
      this.storage.getDeliveryInfo().subscribe((res:any)=>{
        if(res){
          this.setFormValue(res)
          this.buttonName = res.buttonName
        }
        else{
          this.orderAddress.reset()
        }
      })
    }
    else{
      this.storage.getUser().subscribe((res:any) => {
        if(res?.deliveryInformation) this.deliveryInformation = res.deliveryInformation
        else this.getDeliveryInformation()
      })
    }
    
    this.isCheckout = this.rout.url == '/checkout'
  }

  private getDeliveryInformation() {
    const query = `
      query GetUser {
          getUser {
            deliveryInformation {
              deliveryId
              firstName
              lastName
              mobileNumber1
              mobileNumber2
              emailAddress
              address1
              address2
              state
              district
              city
              pinCode
            }
          }
        }`;

    this.apiServices.getUser(query).subscribe((res: any) => {
      this.deliveryInformation = res.deliveryInformation
    })
  }

  setFormValue(val:any) {
    this.orderAddress.patchValue(val)
    this.orderAddress.get('address').patchValue(val)
  }

  placeOrder(payment: any) {

    if (this.orderAddress.invalid) {
      this.snackBar.errorSnackBar("fill the required details")
      return
    }

    let request: any = this.orderAddress.value
    request.products = JSON.parse(this.orders)
    request.paymentDetail = payment

    this.apiServices.placeOrder(request).subscribe(() => {
      this.ngZone.run(()=>{
        this.snackBar.successSnackBar("Orderd Submitted Sucessfully")
        this.rout.navigate(["/home"])
      })
    })

  }

  makePayment() {

    if(this.isCheckout) {
      if (this.orderAddress.valid) this.apiServices.getPayment(JSON.parse(this.orders)).subscribe(res =>{if (res) this.doPayment(res)}) 
      else this.snackBar.errorSnackBar("fill the required details")
    }

    else this.apiServices.updateDeliveryInfo(this.orderAddress.value).subscribe((res:any) => {this.storage.setUser(res); this.snackBar.successSnackBar(this.buttonName + 'Sucessfully')})
      
  }

  async doPayment(res: any) {

    var options: any = {
      key: res.key,
      amount: res.amount,
      currency: res.currency,
      name: "Aerospace",
      description: "Pay Your Bill",
      image: "https://unsplash.com/photos/a-white-couch-sitting-in-a-room-next-to-a-window-txGgKTf9Aio?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash",
      order_id: res.paymentId,
      handler: (response: any) => {
        response.amount = res.amount/100
        
        if (response != null && response.razorpay_payment_id != null) this.placeOrder(response)
        else this.snackBar.errorSnackBar("payment field")
      },
      prefill: {
        name: this.orderAddress.value['firstName'],
        email: this.orderAddress.value['emailAddress'],
        contact: this.orderAddress.value['mobileNumber1']
      },
      notes: {
        address: "Razorpay Corporate Office"
      },
      theme: {
        "color": "#3399cc"
      }

    }

    var razorpay: any = new Razorpay(options)
    razorpay.on('payment.failed', (response: any) => {      
     this.snackBar.errorSnackBar("Payment faield due to tecnical issue")
    });
    razorpay.open()
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.toLowerCase().includes(filterValue));
  }

}
