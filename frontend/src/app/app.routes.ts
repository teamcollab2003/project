import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { BudgetChartComponent } from './components/budget-chart/budget-chart.component';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'statistics',
    component: BudgetChartComponent
  }
];
