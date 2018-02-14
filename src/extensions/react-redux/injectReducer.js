import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getAsyncInjectors } from './asyncInjectors';

/**
 * Dynamically injects asyncReducers
 * @param [{key: string, reducer: function}] array of asyncReducers
 */
export default (...asyncReducers) => (WrappedComponent) => {
  class ReducerInjector extends React.Component {
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      store: PropTypes.object.isRequired,
    };
    static displayName = `withReducer(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;

    componentWillMount() {
      /* Inject each of the resolved asyncReducers */
      const { injectReducer } = this.injectors;
      asyncReducers.forEach(({ key, reducer }) => {
        if (!(key && reducer)) {
          throw new Error('\'key\' or \'reducer\' not defined for withReducer');
        }
        injectReducer(key, reducer);
      });
    }

    injectors = getAsyncInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};
