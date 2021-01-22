import produce from 'immer';
import { combineReducers } from 'redux-immer';

export const RESET = 'core/RESET';

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  const appReducer = combineReducers(produce, { ...asyncReducers });
  const reducer = (state, action) => appReducer(action.type === RESET ? undefined : state, action);
  return reducer;
}
