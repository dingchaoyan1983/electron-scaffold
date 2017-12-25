import React from 'react';
import { Provider } from 'react-redux';
import { compose, pure } from 'recompose';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import createStore from './create-store';
import createRoutes from './create-routes';

const store = createStore(hashHistory);
// eslint-disable-next-line no-undef
if (DEBUG && module.hot) {
  module.hot.accept('./reducers', () => {
    // eslint-disable-next-line global-require
    store.replaceReducer(require('./reducers'));
  });
}

const history = syncHistoryWithStore(hashHistory, store);

export default compose(
  pure,
)(() => (
  <Provider store={store}>
    {createRoutes(history, store)}
  </Provider>
));
