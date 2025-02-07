import { ContextProvider, createContext } from '@lit/context';
import { html } from 'lit';

import { Router } from './lib/router/index.js';
import { HomeComponent } from './pages/home.js';
import { SettingsComponent } from './pages/settings.js';
import { UserDetailsComponent } from './pages/user-details.js';
import { UsersComponent } from './pages/users.js';

export const routerContext = createContext('router');

export function providerRouter(host, routes) {
  const router = new Router({
    routes: routes,
    useHistory: true,
  });
  new ContextProvider(host, {
    context: routerContext,
    initialValue: router,
  });
  return router;
}

export const routes = [
  { path: '/', name: 'home', component: HomeComponent },
  { path: '/settings', name: 'settings', component: SettingsComponent },
  {
    path: '/users',
    name: 'users',
    component: UsersComponent,
    children: [
      {
        path: '',
        render: () => html`<p>Select a user from the list</p>`,
      },
      {
        path: ':id',
        name: 'user-detail',
        component: UserDetailsComponent,
      },
    ],
  },
];
