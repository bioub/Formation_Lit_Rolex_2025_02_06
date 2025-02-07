import { ContextConsumer } from '@lit/context';

import { routerContext } from '../routes';

export function WithRouter(superClass) {
  class WithRouterElement extends superClass {
    _routerConsumer = new ContextConsumer(this, { context: routerContext });

    static properties = {
      router: { type: Object, state: true },
    };

    connectedCallback() {
      super.connectedCallback();
      this.router = this._routerConsumer.value;
    }
  }
  return WithRouterElement;
}
