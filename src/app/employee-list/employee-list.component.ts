import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { openDB } from 'idb';
import { Employee } from '../models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  imports: [RouterModule, DatePipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  router = inject(Router);
  employeesList = signal<Employee[]>([]);
  private db: any;

  async ngOnInit(): Promise<void> {
    this.db = await openDB('employeeDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });

    await this.loadEmployees();
  }

  async loadEmployees(): Promise<void> {
    const employeesList = await this.db.getAll('employees');
    console.log('Employee list:', this.employeesList);
    this.employeesList.set(employeesList);
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/add-employee', employee.id]);
  }

  async onSwipeRight(id: number): Promise<void> {
    await this.db.delete('employees', id);
    await this.loadEmployees(); // Refresh the employee list
  }
}
