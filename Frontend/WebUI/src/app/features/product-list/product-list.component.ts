import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../shared/models/Product';
import { ProductService } from '../../shared/services/ProductService/product.service';
import { CategoryService } from '../../shared/services/CategoryService/category.service';
import { ImageService } from '../../shared/services/ImageService/image.service';
import { CartService } from '../../shared/services/CartService/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  imageService = inject(ImageService);
  cartService = inject(CartService);
  router = inject(Router);

  categoryId = signal<number | null>(null);
  products = signal<Product[]>([]);
  categoryTitle = signal<string | null>(null);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('categoryId'));
      if (id) {
        this.categoryId.set(id);
        this.fetchProducts(id);
      }
    });
    this.fetchCategoryTitle(this.categoryId());
  }

  fetchProducts(categoryId: number) {
    this.productService.getProductsByCategoryId(categoryId).subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error fetching products:', err),
    });
  }

  fetchCategoryTitle(categoryId: number | null) {
    if (categoryId)
      this.categoryService.getCategoryById(categoryId).subscribe({
        next: (data) => this.categoryTitle.set(data.name),
        error: (err) => console.error('Error fetching category title:', err),
      });
  }

  getImageSource(imageUrl: string): string {
    return this.imageService.getImageUrl(imageUrl);
  }

  onClickProductItem(productId: number) {
    this.router.navigateByUrl(`/product/${productId}`);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
