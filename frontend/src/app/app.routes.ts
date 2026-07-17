import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { SocialWelfare } from './pages/social-welfare/social-welfare';
import { Sme } from './pages/sme/sme';   // We'll add this later
import { BudgetChartComponent } from './components/budget-chart/budget-chart.component';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'social-welfare',
    component: SocialWelfare
  },

  {
    path: 'sme',
    component: Sme
  },

  {
    path: 'statistics',
    component: BudgetChartComponent
  }

];


