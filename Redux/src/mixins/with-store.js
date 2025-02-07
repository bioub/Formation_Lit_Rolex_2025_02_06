import { ContextConsumer } from '@lit/context';

import { storeContext } from '../store';

export function WithStore(superClass) {
  class WithStoreElement extends superClass {
    _storeConsumer = new ContextConsumer(this, { context: storeContext });

    static properties = {
      store: { type: Object, state: true },
    };

    connectedCallback() {
      super.connectedCallback();
      this.store = this._storeConsumer.value;
      this.stateChanged(this.store.getState());
      this.store.subscribe(() => {
        this.stateChanged(this.store.getState());
      });
    }

    stateChanged(state) {}
  }
  return WithStoreElement;
}
