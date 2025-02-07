import { DependencyInjector } from './lib/dependencies/DependencyInjector.js';
import { Router } from './lib/router/Router.js';
import { routes } from './routes.js';
import { SettingsStore } from './services/SettingsStore.js';

export const di = new DependencyInjector();

di.provide('router', new Router({
  routes: routes, // les routes configurées
  entry: { url: '/home' }, // la route par défaut
  useHistory: true, // permet d'utiliser l'historique du navigateur back/forward
  useMemory: true, // permet de stocker la dernière route visitée dans le localStorage pour la prochaine visite
}));

di.provide('settings-store', () => {
  return new SettingsStore();
});
