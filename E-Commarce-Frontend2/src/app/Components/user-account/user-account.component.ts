import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatDrawerContainer, MatDrawer } from "@angular/material/sidenav";
import { SnackBarService } from '../../Common/Services/Ui/snack-bar.service';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StorageService } from '../../Common/Services/storage.service';
import { take } from 'rxjs';
import { Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule, FormsModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})
export class UserAccountComponent implements OnInit {

  private snackBar = inject(SnackBarService)
  private apiServices = inject(ApiService)
  private storage = inject(StorageService)
  private rout = inject(Router)
  user: any

  @ViewChild('drawer') drawer: MatDrawer | undefined

  formDisable = true;
  constructor() { }


  ngOnInit(): void {
    this.getUser()

    // this.breakpointObserver.observe(['(max-width: 700px)']).subscribe(result => {
    //   if(this.rout.url=='user' && !result.matches)
    //     this.rout.navigate(['home'])      

    // });

    this.deawerTogle()

  }

  private getUser() {
    const query = `
      query GetUser {
          getUser {
            userName
            email
            mobile
            userRole
            extra
            cart
            cartItem
            extra
            ordersString
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
            orders {
              orderId
              createdDate
              paymentStatus
              deliveryStatus
            }
          }
        }`;

    this.apiServices.getUser(query)?.subscribe((res: any) => {
      this.storage.setUser(res)
      this.user = res
      this.snackBar.successSnackBar(`Welcome ${res?.userName}`)
    })
  }

  // getUserInfo() {
  //   this.storage.getUser().pipe(take(1)).subscribe((res: any) => {
  //    if (this.storage.getToken()) this.getUser()
  //   })
  // }

  deawerTogle() {
    this.storage.getSideNavtoggle().subscribe((res: any) => {
      if (res)
        this.drawer?.toggle()
    })
  }

  toggleEdit(fieldId: any) {
    let field: any = document.getElementById(fieldId);

    field.disabled = !field?.disabled;

    if (!field?.disabled)
      field?.focus();

  }

  deleteDeliveryInfo(deliveryInfo: any) {
    this.storage.getUser().pipe(take(1)).subscribe((res: any) => {
      console.log(res);

      let index = res.deliveryInformation.indexOf(deliveryInfo, 0)
      res.deliveryInformation.splice(index, 1)
    })
    this.apiServices.deleteDeliveryInfo(deliveryInfo.deliveryId).subscribe()
  }

  updateDeliveryInfo(deliveryInfo: any, buttonName: any) {
    deliveryInfo.buttonName = buttonName
    this.storage.setDeliveryInfo(deliveryInfo)
    if (this.rout.url != 'addAddress')
      this.rout.navigate(['addAddress'])
  }

  updateUserInfo(userInfo: any) {
    this.apiServices.updateUserInfo(userInfo.value).subscribe((res: any) => {
      this.storage.setToken(res.extra)
      this.storage.setUser(res)
      this.snackBar.successSnackBar("Information Updated Sucessfully")
      this.formDisable = true
    })
  }


}

