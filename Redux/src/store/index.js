import { ContextProvider, createContext } from '@lit/context';
import { configureStore } from '@reduxjs/toolkit';

import { reducer } from './reducers';

export const storeContext = createContext('store');

export function provideStore(host) {
  const store = configureStore({
    reducer: reducer,
  });
  new ContextProvider(host, {
    context: storeContext,
    initialValue: store,
  });
  return store;
}
