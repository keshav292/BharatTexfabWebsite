import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CartService } from '../../shared/services/CartService/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  customer = {
    name: '',
    phone: '',
    email: '',
  };

  constructor(public cartService: CartService) {}

  sendOrderByEmail() {
    const orderDetails = this.formatOrder();
    const subject = encodeURIComponent('New Order from Bharat Texfab');
    const body = encodeURIComponent(orderDetails);

    window.location.href = `mailto:bharattexfabjpr@gmail.com?subject=${subject}&body=${body}`;
  }

  sendOrderByWhatsApp() {
    const orderDetails = this.formatOrder();
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
      orderDetails
    )}`;

    window.open(whatsappUrl, '_blank');
  }

  private formatOrder(): string {
    let message = `Order Details:\n\n`;
    this.cartService.items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} - ${item.quantity} x ₹${
        item.product.price
      }\n`;
    });

    message += `\nCustomer Info:\nName: ${
      this.customer.name || 'N/A'
    }\nPhone: ${this.customer.phone}\nEmail: ${this.customer.email || 'N/A'}`;

    return message;
  }
}
