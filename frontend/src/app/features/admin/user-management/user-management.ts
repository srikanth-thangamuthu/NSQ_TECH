import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../core/services/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {

  name = '';
  email = '';
  role = 'General User';

  message = '';
  messageType = '';

  searchText = '';

  editingUserId: number | null = null;

  currentPage = 1;
  pageSize = 5;

  users: any[] = [];

  loading = false;
  saving = false;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {

  this.userService.getUsers().subscribe({
    next: (data) => {

      this.users = data;

      this.currentPage = 1;

    },
    error: () => {

      this.showMessage(
        'Failed to load users',
        'error'
      );

    }
  });

}

  showMessage(text: string, type: string) {
    this.message = text;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 2000);
  }

  addUser() {
    if (!this.name || !this.email) {
      this.showMessage('Please enter name and email', 'error');
      return;
    }

    const user = {
      name: this.name,
      email: this.email,
      role: this.role,
      status: 'Active'
    };

    if (this.editingUserId !== null) {
      this.updateUser(user);
      return;
    }

    const tempUser = {
      id: Date.now(),
      ...user
    };

    this.users.unshift(tempUser);
    this.currentPage = 1;
    this.showMessage('User added successfully', 'success');
    this.resetForm();

    this.userService.addUser(tempUser).subscribe({
      next: (savedUser) => {
        this.users = this.users.map(existingUser =>
          existingUser.id === tempUser.id ? savedUser : existingUser
        );
      },
      error: () => {
        this.showMessage('Backend failed, but UI updated', 'error');
      }
    });
  }

  updateUser(user: any) {
    const id = this.editingUserId;

    if (id === null) {
      return;
    }

    const oldUsers = [...this.users];

    this.users = this.users.map(existingUser =>
      existingUser.id === id
        ? {
            ...existingUser,
            ...user
          }
        : existingUser
    );

    this.showMessage('User updated successfully', 'success');
    this.resetForm();

    this.userService.updateUser(id, user).subscribe({
      error: () => {
        this.users = oldUsers;
        this.showMessage('Update failed, restored user', 'error');
      }
    });
  }

  editUser(user: any) {
    this.editingUserId = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
  }

  deleteUser(id: number) {
    const oldUsers = [...this.users];

    this.users = this.users.filter(user => user.id !== id);
    this.showMessage('User deleted successfully', 'success');

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    this.userService.deleteUser(id).subscribe({
      error: () => {
        this.users = oldUsers;
        this.showMessage('Delete failed, restored user', 'error');
      }
    });
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.role = 'General User';
    this.editingUserId = null;
  }

  get filteredUsers() {
    if (!this.searchText || this.searchText.trim() === '') {
      return this.users;
    }

    const search = this.searchText.toLowerCase();

    return this.users.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredUsers.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}