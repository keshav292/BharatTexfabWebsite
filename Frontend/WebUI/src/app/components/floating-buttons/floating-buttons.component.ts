import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './floating-buttons.component.html',
  styleUrl: './floating-buttons.component.css',
})
export class FloatingButtonsComponent {
  phoneNumber: string = environment.phoneNumber;
  whatsappNumber: string = environment.whatsappNumber;

  getWhatsAppLink(): string {
    return `https://wa.me/${this.whatsappNumber}`;
  }

  getCallLink(): string {
    return `tel:${this.phoneNumber}`;
  }
}
