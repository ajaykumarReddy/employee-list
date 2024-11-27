import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';

export const routes: Routes = [
  {
    path: 'employee-list',
    component: EmployeeListComponent,
  },
  {
    path: 'add-employee',
    loadComponent: () =>
      import('./add-employee/add-employee.component').then(
        (m) => m.AddEmployeeComponent
      ),
  },
  {
    path: 'add-employee/:id',
    loadComponent: () =>
      import('./add-employee/add-employee.component').then(
        (m) => m.AddEmployeeComponent
      ),
  },
  {
    path: '',
    redirectTo: 'employee-list',
    pathMatch: 'full',
  },
];
