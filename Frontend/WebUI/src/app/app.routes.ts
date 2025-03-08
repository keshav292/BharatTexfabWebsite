import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductListComponent } from './features/product-list/product-list.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AuthGuard } from './shared/auth.guard';
import { AdminComponent } from './features/admin/admin.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin-routing.module').then(
        (m) => m.adminRoutes
      ),
  },
  { path: 'products/:categoryId', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
];
