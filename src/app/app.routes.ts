import { Routes } from '@angular/router';
import { AdminComponent } from './admin-component/admin-component';
import { DetailComponent } from './detail-component/detail-component';
import { Roster } from './roster/roster';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'roster', component: Roster },
      { path: 'roster/player/:id', component: DetailComponent },
      { path: 'entry', component: AdminComponent },
      { path: ' ', redirectTo: 'roster', pathMatch: 'full' },
      { path: '**', redirectTo: 'roster' },
    ],
  },
];
