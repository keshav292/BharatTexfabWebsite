import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Product } from '../../shared/models/Product';
import { ProductService } from '../../shared/services/ProductService/product.service';
import { ImageService } from '../../shared/services/ImageService/image.service';
import { CartService } from '../../shared/services/CartService/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  productService = inject(ProductService);
  imageService = inject(ImageService);
  cartService = inject(CartService);
  product: Product | null = null;
  productId: Number | undefined;
  productImageUrl: String | undefined;

  constructor(private route: ActivatedRoute) {
    this.productId = Number(this.route.snapshot.paramMap.get('productId'));
    console.log('Product id is ' + this.productId);
  }

  ngOnInit() {
    if (this.productId)
      this.productService.getProductById(this.productId).subscribe({
        next: (data) => {
          this.product = data;
          this.productImageUrl = this.imageService.getImageUrl(
            this.product.imageUrl
          );
        },
      });
  }

  addToCart() {
    if (this.product) this.cartService.addToCart(this.product);
  }
}
