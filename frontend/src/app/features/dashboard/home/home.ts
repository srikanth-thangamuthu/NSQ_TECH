
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { RecordService } from '../../../core/services/record';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  user: any;
  loading = false;
  isadmin = false;

  records: any[] = [
    {
      candidate: 'Arun Kumar',
      company: 'TCS',
      status: 'Verified',
      accessLevel: 'General User'
    },
    {
      candidate: 'Priya Sharma',
      company: 'Infosys',
      status: 'Pending',
      accessLevel: 'General User'
    },
    {
      candidate: 'Karthik Raj',
      company: 'Wipro',
      status: 'Rejected',
      accessLevel: 'Admin'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private recordService: RecordService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isadmin = this.user?.role === 'Admin';

    this.recordService.getRecords().subscribe({
      next: (data) => {
        this.records = data;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}