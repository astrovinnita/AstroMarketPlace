import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { SnackBarService } from '../../Common/Services/Ui/snack-bar.service';
import { Router } from '@angular/router';
import { StorageService } from '../../Common/Services/storage.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  ngOnInit(): void {}

  sended = false
  errorMessage: any

  private apiServices = inject(ApiService)
  private snackBar = inject(SnackBarService)
  storage = inject(StorageService)
  private route = inject(Router)

  signUp() {

    let email: any = document?.getElementById('email')
    let otp: any = document?.getElementById('otp')

    if (this.sended) {
      let val = { "email": email?.value, "otp": otp?.value }
      this.verify(val)
    }

    else {
      this.errorMessage = undefined

      if (!email?.value) {
        email.focus()
        email.style.outline = "1px solid red"

        this.errorMessage = "Invalid Email"
        return
      }

      this.apiServices.login({ "email": email.value }).subscribe((res: any) => {
        this.snackBar.successSnackBar(res)
        this.sended = true
      })

    }
  }

  verify(val: any) {

    this.apiServices.getToken(val).subscribe(({
      next: (res: any) => {
        this.storage.setToken(res)
        this.route.navigate(["home"])
        this.storage.setUser(undefined)
        
      }, error: (err: any) => {

        err.error = JSON.parse(err.error)
        
        if (err.error.message == "Bad credentials")
          this.errorMessage = "Invalid OTP"
        else
          this.errorMessage = err.error.message
      }
    }))

  }


}
