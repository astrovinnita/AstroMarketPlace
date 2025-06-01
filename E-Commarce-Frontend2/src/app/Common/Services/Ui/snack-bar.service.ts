import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor() { }

  private snackBarSubject = new BehaviorSubject<any>(undefined)

  errorSnackBar(message: any) {
    this.snackBarSubject.next({ui:"error",message:message})
    this.setDuration(5000)
  }

  successSnackBar(message: any) {
    this.snackBarSubject.next({ui:"success",message:message})
    this.setDuration(5000)
  }

  setDuration(time:any){

    setTimeout(() => {
      this.snackBarSubject.next(undefined)
    }, time);

  }

  getSnackBar(){
    return this.snackBarSubject
  }


  // --------------------------------- progress Bar ------------------------------


  progressBar = new BehaviorSubject(false)

  startProgressBar(){
    this.progressBar.next(true)
  }

  endProgressBar(){
    this.progressBar.next(false)
  }
}
