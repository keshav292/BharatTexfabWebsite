import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../../shared/services/CartService/cart.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { Order, OrderItem } from '../../shared/models/Order';
import { ImageService } from '../../shared/services/ImageService/image.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatCard, MatCardContent, MatIcon, MatCardActions, NgIf, NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  imageService = inject(ImageService);
  order: OrderItem[];

  constructor() {
    this.order = [];
  }

  checkout() {}

  ngOnInit() {
    this.order = this.cartService.items;
    console.log('Order is');
    console.log(this.order);
  }
}
