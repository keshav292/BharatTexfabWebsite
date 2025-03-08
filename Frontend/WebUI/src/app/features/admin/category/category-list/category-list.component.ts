import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../../../../shared/models/Category';
import { CategoryService } from '../../../../shared/services/CategoryService/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterModule, MatIcon],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent {
  categories = signal<Category[]>([]);
  router = inject(Router);

  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService
      .getCategories()
      .subscribe((data) => this.categories.set(data));
  }

  deleteCategory(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.fetchCategories(); // Refresh list
        this.snackBar.open('Category deleted successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(err.message, 'Close', { duration: 3000 });
      },
    });
  }
}
