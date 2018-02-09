/**
 * Based on https://github.com/react-boilerplate/react-boilerplate/
 */

import conformsTo from 'lodash/conformsTo';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import invariant from 'invariant';
import createReducer from 'extensions/redux/reducers';

export function checkStore(store) {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    asyncReducers: isObject,
  };
  invariant(
    conformsTo(store, shape),
    '(app/utils...) asyncInjectors: Expected a valid redux store'
  );
}

export function injectAsyncReducer(store, isValid) {
  return function injectReducer(name, asyncReducer) {
    if (!isValid) checkStore(store);

    invariant(
      isString(name) && !isEmpty(name) && isFunction(asyncReducer),
      '(app/utils...) injectAsyncReducer: Expected `asyncReducer` to be a reducer function'
    );

    if (Reflect.has(store.asyncReducers, name)) return;

    store.asyncReducers[name] = asyncReducer; // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.asyncReducers));
  };
}

/**
 * Inject an asynchronously loaded firestore listener
 */
export function injectAsyncFirestoreListener(store) {
  return function injectFirestoreListener(name, asyncListener) {
    invariant(
      isString(name) && !isEmpty(name) && isFunction(asyncListener),
      '(app/utils...) injectFirestoreListener: Expected `asyncListener` to be a firestore listener function'
    );

    if (Reflect.has(store.asyncFirestoreListeners, name)) return;

    store.asyncFirestoreListeners[name] = asyncListener; // eslint-disable-line no-param-reassign
    asyncListener(store.dispatch);
  };
}

/**
 * Helper for creating injectors
 */
export function getAsyncInjectors(store) {
  checkStore(store);

  return {
    injectReducer: injectAsyncReducer(store, true),
    injectFirestoreListener: injectAsyncFirestoreListener(store),
  };
}
