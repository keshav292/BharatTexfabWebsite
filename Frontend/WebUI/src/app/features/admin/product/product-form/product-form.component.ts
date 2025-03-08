import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../../shared/services/ProductService/product.service';
import { CategoryService } from '../../../../shared/services/CategoryService/category.service';
import { Category } from '../../../../shared/models/Category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductDto } from '../../../../shared/dto/ProductDto';
import { ImageService } from '../../../../shared/services/ImageService/image.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf, NgFor } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-form',
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
    MatSelectModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  printForm() {
    console.log(this.productForm);
  }
  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    description: new FormControl('', Validators.required),
    categoryId: new FormControl(0, Validators.required),
    imageUrl: new FormControl('', Validators.required),
  });

  categories: Category[] = [];
  isEditMode = false;
  productId: number | null = null;
  imageUploading = signal(false);
  imageUploadError = signal<string | null>(null);
  imageSrc: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.checkEditMode();
    this.printForm();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: () => console.error('Failed to load categories'),
    });
  }

  checkEditMode() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !isNaN(this.productId) && this.productId > 0;

    if (this.isEditMode) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          this.imageSrc = this.imageService.getImageUrl(product.imageUrl);
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
      error: () => console.error('Failed to load image'),
    });
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.imageUploadError.set('File size should not exceed 2MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.imageUploadError.set('Only JPG, PNG, and WEBP formats are allowed.');
      return;
    }

    this.imageUploading.set(true);
    this.imageService.upload(file).subscribe({
      next: (response) => {
        this.productForm.patchValue({ imageUrl: response.url });
        this.fetchImage(response.url);
        this.imageUploading.set(false);
      },
      error: () => {
        this.imageUploadError.set('Failed to upload image. Try again.');
        this.imageUploading.set(false);
      },
    });
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    const productData: ProductDto = {
      name: this.productForm.value.name!,
      price: this.productForm.value.price!,
      description: this.productForm.value.description!,
      categoryId: this.productForm.value.categoryId!,
      imageUrl: this.productForm.value.imageUrl!,
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.snackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate([
            `/admin/categories/${productData.categoryId}/products`,
          ]);
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Close', { duration: 3000 });
        },
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.snackBar.open('Product added successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate([
            `/admin/categories/${productData.categoryId}/products`,
          ]);
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Close', { duration: 3000 });
        },
      });
    }
  }
}
