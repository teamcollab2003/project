import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { SocialWelfare } from './pages/social-welfare/social-welfare';
import { Sme } from './pages/sme/sme';   // We'll add this later

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
  }

];