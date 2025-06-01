import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { ProductListComponent } from './Components/product-list/product-list.component';
import { ProductViewComponent } from './Components/product-view/product-view.component';
import { CartComponent } from './Components/cart/cart.component';
import { DeliveryFormComponent } from './Components/delivery-form/delivery-form.component';
import { UserAccountComponent } from './Components/user-account/user-account.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { DemoComponent } from './Components/demo/demo.component';
import { OrdersListComponent } from './Components/orders-list/orders-list.component';
import { AddProductComponent } from './Components/add-product/add-product.component';

export const routes: Routes = [
    
    {path:'',redirectTo:"home",pathMatch:"full"},
    {path:"home",component:LandingPageComponent},
    {path:"products",component:ProductListComponent},
    {path:"products/search/:searchValue",component:ProductListComponent},
    {path:"products/:id" , component:ProductViewComponent},
    {path:"cart", component:CartComponent},
    {path:"checkout",component:DeliveryFormComponent},
    {path:"addAddress",component:DeliveryFormComponent},
    {path:"user",component:UserAccountComponent},
    {path:"",component:UserAccountComponent, outlet:'user'},
    {path:"orderInfo", component:OrdersComponent},
    {path:"orders", component:OrdersListComponent},
    {path:"signUp", component:SignUpComponent},
    {path:'orders', component:OrdersListComponent},
    {path:"demo", component:DemoComponent},
    {path:"addProduct", component:AddProductComponent},
    

];
    