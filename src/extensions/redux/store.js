/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import createReducer from './reducers';

export default function configureStore(
    initialState = {},
    history,
    middlewares = []) {
  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
  /* eslint-enable */

  // Extensions
  store.asyncReducers = {}; // Async reducer registry
  store.asyncFirestoreListeners = {}; // Async firestore listeners registry

  const store = createStore(
    createReducer(store.asyncReducers),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  // Make asyncReducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./asyncReducers', () => {
      store.replaceReducer(createReducer(store.asyncReducers));
    });
  }

  return store;
}
