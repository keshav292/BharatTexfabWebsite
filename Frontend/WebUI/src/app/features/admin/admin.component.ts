import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { AuthService } from '../../shared/services/AuthenticationService/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  authService = inject(AuthService);
  isAdmin: boolean = false;

  AdminComponent() {
    this.isAdmin = this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout();
  }
}
