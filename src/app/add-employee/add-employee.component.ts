import { Component, computed, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { openDB } from 'idb';
import { Employee } from '../models';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private db: any;
  public id = input('id');
  public employeeForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
  });

  public isEdit = computed(() => !!this.id());

  async ngOnInit(): Promise<void> {
    console.log('Employee ID:', this.id());
    // get the employee details from the database
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

    if (this.id()) {
      const employee: Employee = await this.getEmployeeById(+this.id());
      this.employeeForm.patchValue(employee);
    }
  }

  async getEmployeeById(id: number): Promise<Employee> {
    return await this.db.get('employees', id);
  }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.valid) {
      if (this.id()) {
        const employee: any = {
          ...this.employeeForm.value,
          id: +this.id(),
        };
        await this.db.put('employees', employee);
      } else {
        await this.db.add('employees', this.employeeForm.value);
      }
      this.onCancel();
    }
  }

  onCancel(): void {
    this.employeeForm.reset();
    this.router.navigate(['/employee-list']);
  }
}
