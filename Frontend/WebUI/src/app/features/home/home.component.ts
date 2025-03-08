import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { CategoryService } from '../../shared/services/CategoryService/category.service';
import { Category } from '../../shared/models/Category';
import { ImageService } from '../../shared/services/ImageService/image.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardContent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  categoryService = inject(CategoryService);
  imageService = inject(ImageService);
  router = inject(Router);

  categories = signal<Category[]>([]); // ✅ Use Angular Signal for state management

  constructor() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data), // ✅ Update the signal
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  onCategoryClicked(category: Category) {
    this.router.navigateByUrl(`/products/${category.id}`); // ✅ Navigate with category ID
  }

  getImageSource(imageUrl: string): string {
    return this.imageService.getImageUrl(imageUrl);
  }
}
