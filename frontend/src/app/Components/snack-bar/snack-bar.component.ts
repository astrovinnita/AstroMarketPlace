import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarService } from '../../Common/Services/Ui/snack-bar.service';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {
  type:any

  snackUI:any = {error:{icon:"error_outline",color:"red"}, warning:{icon:"warning",color:"#F7C752"}, success:{icon:"check_circle",color:"green"}}

  constructor(private snackBar:SnackBarService) { }

  ngOnInit(): void {
    
    this.snackBar.getSnackBar().subscribe((res:any)=>{
      this.type = res
    })

  }

  closeSnackBar(){
    this.snackBar.setDuration(0)
  }
}
