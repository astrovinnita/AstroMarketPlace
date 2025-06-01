import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../Common/Services/storage.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,RouterModule],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.css'
})
export class BottomNavbarComponent {

  private storage = inject(StorageService)
  private route = inject(Router)

  navigateToOrders(){
      this.storage.getUser().pipe(take(1)).subscribe((res:any) => {
        if(res)
          this.route.navigate(['orders'])
        else
          this.route.navigate(['orderInfo'])
      })
    }

}
