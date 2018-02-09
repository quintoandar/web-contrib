/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable';

export const RESET = 'core/RESET';

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  const appReducer = combineReducers({ ...asyncReducers });
  const reducer = (state, action) => appReducer(action.type === RESET ? undefined : state, action);
  console.log(reducer);
  return reducer;
}
 