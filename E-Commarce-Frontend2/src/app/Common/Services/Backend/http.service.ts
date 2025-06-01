import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { SnackBarService } from '../Ui/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient,private snackBar:SnackBarService) { }

  private commonMessage = "Server is Not Working plase try again letter"

  post(url: any, data: any, responseType?: any, headers?: any) {

    this.snackBar.startProgressBar()

    return this.http.post(url, data, { headers, responseType: responseType }).pipe(catchError((err: any) => {
      if (err?.status == 0) err.error.message = this.commonMessage
      
      err.error = JSON.parse(err?.error)

      if (err?.error?.message) this.snackBar?.errorSnackBar(err?.error?.message)
      else this.snackBar.errorSnackBar("Some thing went wrong please try again leter")

      throw err;
    }), finalize(() => this.snackBar.endProgressBar() ))

  }

  delete(url: any, responseType?: any, headers?: any) {

    this.snackBar.startProgressBar()

    return this.http.delete(url, { headers, responseType: responseType }).pipe(catchError((err: any) => {
      if (err?.status == 0) err.error.message = this.commonMessage

      err.error = JSON.parse(err?.error)

      if (err?.error?.message) this.snackBar?.errorSnackBar(err?.error?.message)
      else this.snackBar.errorSnackBar("Some thing went wrong please try again leter")

      throw err;
    }), finalize(() => this.snackBar.endProgressBar() ))

  }

  get(url: any, responseType?: any, headers?: any) {

    this.snackBar.startProgressBar()

    return this.http.get(url, { headers, responseType: responseType }).pipe(catchError((err: any) => {
      if (err?.status == 0) err.error.message = this.commonMessage

      err.error = JSON.parse(err?.error)

      if (err?.error?.message) this.snackBar?.errorSnackBar(err?.error?.message)
      else this.snackBar.errorSnackBar("Some thing went wrong please try again leter")

      throw err;
    }), finalize(()=> this.snackBar.endProgressBar()))
  }
}
