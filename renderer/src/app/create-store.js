import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import reducers from './reducers';

export default (history) => {
  const middlewares = [
    routerMiddleware(history),
  ];

  // eslint-disable-next-line no-undef
  if (DEBUG) {
    // eslint-disable-next-line global-require
    const createLogger = require('redux-logger');
    middlewares.push(createLogger({
      collapsed: true,
    }));
  }

  return compose(
    applyMiddleware(...middlewares),
  )(createStore)(
    reducers,
    // eslint-disable-next-line no-underscore-dangle
    global.__REDUX_DEVTOOLS_EXTENSION__ && global.__REDUX_DEVTOOLS_EXTENSION__(),
  );
};
