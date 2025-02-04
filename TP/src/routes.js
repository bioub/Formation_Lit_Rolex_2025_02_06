import { HomeComponent } from './pages/home';
import { SettingsComponent } from './pages/settings';
import { UsersComponent } from './pages/users';

export const routes = [
  { path: '/', name: 'home', component: HomeComponent },
  { path: '/settings', name: 'settings', component: SettingsComponent },
  {
    path: '/users',
    name: 'users',
    component: UsersComponent,
  },
];
