import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../../shared/models/Product';
import { ProductService } from '../../../../shared/services/ProductService/product.service';
import { CategoryService } from '../../../../shared/services/CategoryService/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatIcon, MatTableModule, MatButtonModule, RouterModule, MatIcon],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products = signal<Product[]>([]);
  router = inject(Router);

  categoryId!: number;
  categoryName!: string;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));
    if (!isNaN(this.categoryId)) {
      this.loadProducts();
      console.log('categoryID;: ' + this.categoryId);
      this.fetchCategoryName();
    }
  }

  fetchCategoryName() {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (data) => (this.categoryName = data.name),
    });
  }

  loadProducts(): void {
    this.productService.getProductsByCategoryId(this.categoryId).subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error loading products:', err),
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products.set(this.products().filter((p) => p.id !== productId));
        },
        error: (err) => console.error('Error deleting product:', err),
      });
    }
  }
}
