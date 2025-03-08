import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../../shared/services/CategoryService/category.service';
import { Category } from '../../../../shared/models/Category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryDto } from '../../../../shared/dto/CategoryDto';
import { ImageService } from '../../../../shared/services/ImageService/image.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatProgressBar,
    MatIcon,
    MatCardTitle,
    MatCardContent,
    NgIf,
    RouterModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent implements OnInit {
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
  });

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.checkEditMode();
  }

  imageUploading = signal(false);
  imageUploadError = signal<string | null>(null);
  imageSrc: string | null = null;
  isEditMode = false;
  categoryId!: number;
  category!: Category;

  checkEditMode() {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !isNaN(this.categoryId) && this.categoryId > 0;

    if (this.isEditMode) {
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category) => {
          this.categoryForm.patchValue(category);
          this.imageSrc = this.imageService.getImageUrl(category.imageUrl);
        },
        error: () => console.error('Failed to load product'),
      });
    }
  }

  fetchImage(url: string) {
    this.imageService.getImageByUrl(url).subscribe({
      next: (blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.imageSrc = objectURL;
      },
      error: () => {
        console.error('Failed to load image.');
      },
    });
  }

  uploadImage(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    // Image size validation (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.imageUploadError.set('File size should not exceed 2MB.');
      return;
    }

    // Image format validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.imageUploadError.set('Only JPG, PNG, and WEBP formats are allowed.');
      return;
    }

    this.imageUploading.set(true);

    this.imageService.upload(file).subscribe({
      next: (response) => {
        console.log(response);
        this.categoryForm.patchValue({ imageUrl: response.url });
        this.fetchImage(response.url);
        this.imageUploading.set(false);
      },
      error: () => {
        this.imageUploadError.set('Failed to upload image. Try again.');
        this.imageUploading.set(false);
      },
    });
  }

  saveCategory() {
    if (
      this.categoryForm.valid &&
      this.categoryForm.value.name &&
      this.categoryForm.value.imageUrl
    ) {
      const categoryData: CategoryDto = {
        name: this.categoryForm.value.name,
        ImageUrl: this.categoryForm.value.imageUrl,
      };
      this.categoryService.addCategory(categoryData).subscribe({
        next: () => {
          this.snackBar.open('Category added successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Close', { duration: 3000 });
        },
      });
    }
  }
}
