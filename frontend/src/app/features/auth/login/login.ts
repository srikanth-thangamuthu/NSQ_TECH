import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  userId = '';
  password = '';
  role = 'General User';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    console.log('Login button clicked');

    this.authService.login(this.userId, this.password, this.role).subscribe({
      next: (res) => {
        this.authService.saveUser(res);

        if (res.user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.log('Login error:', err);
        alert('Invalid credentials');
      }
    });
  }
}
