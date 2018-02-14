import { fromJS } from 'immutable';
import { memoryHistory } from 'react-router';
import configureStore from 'extensions/redux/store';

import {
  injectAsyncReducer,
  injectAsyncFirestoreListener,
  getAsyncInjectors,
} from '../asyncInjectors';

// Fixtures

const initialState = fromJS({ reduced: 'soon' });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TEST':
      return state.set('reduced', action.payload);
    default:
      return state;
  }
};

const firestoreListener = (dispatch) => {
  dispatch({
    type: 'TEST_ACTION',
    data: { foo: 'jkbzrk' },
  });
};

describe('asyncInjectors', () => {
  let store;

  describe('getAsyncInjectors', () => {
    beforeAll(() => {
      store = configureStore({}, memoryHistory);
    });

    it('given a store, should return all async injectors', () => {
      const { injectReducer } = getAsyncInjectors(store);

      injectReducer('test', reducer);
      store.dispatch({ type: 'TEST', payload: 'yup' });

      const actual = store.getState().get('test');
      const expected = initialState.merge({ reduced: 'yup' });

      expect(actual.toJS()).toEqual(expected.toJS());
    });

    it('should throw if passed invalid store shape', () => {
      let result = false;

      delete store.dispatch;

      try {
        getAsyncInjectors(store);
      } catch (err) {
        result = err.name === 'Invariant Violation';
      }

      expect(result).toEqual(true);
    });
  });

  describe('helpers', () => {
    beforeAll(() => {
      store = configureStore({}, memoryHistory);
    });

    describe('injectAsyncReducer', () => {
      it('given a store, it should provide a function to inject a reducer', () => {
        const injectReducer = injectAsyncReducer(store);

        injectReducer('test', reducer);

        const actual = store.getState().get('test');
        const expected = initialState;

        expect(actual.toJS()).toEqual(expected.toJS());
      });

      it('should not assign reducer if already existing', () => {
        const injectReducer = injectAsyncReducer(store);

        injectReducer('test', reducer);
        injectReducer('test', () => {});

        expect(store.asyncReducers.test.toString()).toEqual(reducer.toString());
      });

      it('should throw if passed invalid name', () => {
        let result = false;

        const injectReducer = injectAsyncReducer(store);

        try {
          injectReducer('', reducer);
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        try {
          injectReducer(999, reducer);
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        expect(result).toEqual(true);
      });

      it('should throw if passed invalid reducer', () => {
        let result = false;

        const injectReducer = injectAsyncReducer(store);

        try {
          injectReducer('bad', 'nope');
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        try {
          injectReducer('coolio', 12345);
        } catch (err) {
          result = err.name === 'Invariant Violation';
        }

        expect(result).toEqual(true);
      });
    });

    describe('injectAsyncFirestoreListener', () => {
      let listenerStore;
      let injectFirestoreListener;

      beforeEach(() => {
        jest.resetAllMocks();
        listenerStore = {
          dispatch: jest.fn(),
          asyncFirestoreListeners: [],
        };
        injectFirestoreListener = injectAsyncFirestoreListener(listenerStore);
      });

      it('given a store, it should provide a function to inject a firestore listener', () => {
        injectFirestoreListener('test', firestoreListener);

        expect(listenerStore.asyncFirestoreListeners.test).toBe(firestoreListener);
        expect(listenerStore.dispatch).toHaveBeenCalled();
      });

      it('should not assign listener if already existing', () => {
        injectFirestoreListener('test', firestoreListener);
        injectFirestoreListener('test', () => {});

        expect(listenerStore.asyncFirestoreListeners.test.toString())
          .toEqual(firestoreListener.toString());
      });

      it('should throw if passed invalid name - empty', () => {
        expect(() => injectFirestoreListener('', firestoreListener)).toThrowErrorMatchingSnapshot();
      });

      it('should throw if passed invalid name - number', () => {
        expect(() => injectFirestoreListener(999, firestoreListener)).toThrowErrorMatchingSnapshot();
      });

      it('should throw if passed invalid listener - number', () => {
        expect(() => injectFirestoreListener('coolio', 12345)).toThrowErrorMatchingSnapshot();
      });

      it('should throw if passed invalid listener - string', () => {
        expect(() => injectFirestoreListener('bad', 'nope')).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
