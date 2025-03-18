import { Injectable, computed, signal } from '@angular/core';

import { OrderItem } from '../../models/Order';
import { Product } from '../../models/Product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<OrderItem[]>([]);
  private totalAmount = signal<number>(0);

  // ✅ Computed signal to track total cart items dynamically
  totalCartItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  constructor() {}

  get items() {
    return this.cartItems();
  }

  get total() {
    return this.totalAmount();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItems.set([...currentItems]);
    this.updateTotal();
  }

  removeFromCart(productId: number, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex !== -1) {
      if (currentItems[itemIndex].quantity > quantity) {
        currentItems[itemIndex].quantity -= quantity; // Reduce quantity
      } else {
        currentItems.splice(itemIndex, 1); // Remove product if quantity reaches zero
      }
    }

    this.cartItems.set([...currentItems]);
    this.updateTotal();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.totalAmount.set(0);
  }

  private updateTotal(): void {
    const total = this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    this.totalAmount.set(total);
  }

  getTotalCartItems(): number {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }
}
