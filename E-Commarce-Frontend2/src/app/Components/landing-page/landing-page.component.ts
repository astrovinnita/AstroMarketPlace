import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Common/Services/Backend/api.service';
import { TopNavbarComponent } from "../NavBar/top-navbar/top-navbar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { BottomNavbarComponent } from "../NavBar/bottom-navbar/bottom-navbar.component";
import { ProductListComponent } from "../product-list/product-list.component";

@Component({
    selector: 'app-landing-page',
    standalone: true,
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css',
    imports: [TopNavbarComponent, BottomNavbarComponent, ProductListComponent]
})
export class LandingPageComponent implements OnInit {

  constructor(private apiServices: ApiService, private activatedRout: ActivatedRoute, private rout: Router) { }

  ngOnInit(): void {

  }



}
