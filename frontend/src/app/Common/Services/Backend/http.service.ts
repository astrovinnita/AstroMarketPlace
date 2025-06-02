import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { SnackBarService } from '../Ui/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private snackBar: SnackBarService) { }

  private commonMessage = "Server is Not Working plase try again letter"

  post(url: any, data: any, responseType: any = 'json', headers: any = {}) {
    return this.withProgress(this.http.post(url, data, { headers, responseType: responseType }))
  }

  delete(url: string, responseType: any = 'json', headers: any = {}) {
    return this.withProgress(this.http.delete(url, { headers, responseType }))
  }

  get(url: string, responseType: any = 'json', headers: any = {}) {
    return this.withProgress(this.http.get(url, { headers, responseType }))
  }

  private withProgress<T>(observable: Observable<T>): Observable<T> { 
    this.snackBar.startProgressBar();

    return observable.pipe(
      catchError(err => this.handleError(err)),
      finalize(() => this.snackBar.endProgressBar())
    );
  }

   private handleError(err: any) {
    try {
      if (err?.status === 0) {
        err.error = { message: this.commonMessage };
      } else if (typeof err?.error === 'string') {
        err.error = JSON.parse(err.error);
      }

      const message = err?.error?.message || "Something went wrong, please try again later.";
      this.snackBar.errorSnackBar(message);
    } catch {
      this.snackBar.errorSnackBar("Something went wrong, please try again later.");
    }

    return throwError(() => err);
  }

}
