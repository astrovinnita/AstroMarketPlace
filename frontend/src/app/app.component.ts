import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackBarComponent } from "./Components/snack-bar/snack-bar.component";
import { TopNavbarComponent } from "./Components/NavBar/top-navbar/top-navbar.component";
import { BottomNavbarComponent } from "./Components/NavBar/bottom-navbar/bottom-navbar.component";
import { StorageService } from './Common/Services/storage.service';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ProgressBarComponent } from './Components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, SnackBarComponent, TopNavbarComponent, BottomNavbarComponent, MatDrawerContainer, MatDrawer, MatDrawerContent, ProgressBarComponent]
})
export class AppComponent implements OnInit {

  isMobile: boolean = false;
  private storage = inject(StorageService)

  @ViewChild('drawer') drawer:any
  
  constructor(private breakpointObserver: BreakpointObserver){}

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.isMobile = result.matches;
    });

    this.storage.getSideNavtoggle().subscribe((res:any) => {
      this.drawer.toggle()
    })

  }

}
