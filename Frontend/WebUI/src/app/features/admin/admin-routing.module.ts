import { Routes, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../shared/services/AuthenticationService/auth.service';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { CategoryFormComponent } from './category/category-form/category-form.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { AdminComponent } from './admin.component';

const authGuard = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated() ? true : ['/login']; // Redirect if not admin
};

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      {
        path: 'categories',
        component: CategoryListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'categories/add',
        component: CategoryFormComponent,
        canActivate: [authGuard],
      },
      {
        path: 'categories/edit/:id',
        component: CategoryFormComponent,
        canActivate: [authGuard],
      },
      {
        path: 'categories/:categoryId/products',
        component: ProductListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'products',
        component: ProductListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'products/add',
        component: ProductFormComponent,
        canActivate: [authGuard],
      },
      {
        path: 'products/edit/:id',
        component: ProductFormComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
