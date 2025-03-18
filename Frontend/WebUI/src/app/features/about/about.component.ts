import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  openGoogleMaps() {
    const googleMapsUrl = 'https://www.google.com/maps?q=Bharat+Texfab,Jaipur';
    window.open(googleMapsUrl, '_blank');
  }
}
