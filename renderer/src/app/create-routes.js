import React from 'react';
import { Router } from 'react-router';
import Layout from './containers/layout.js';

const routes = (store, lang) => [
  {
    path: '/',
    component: (props) => <Layout />,
  }
];

export default (history, store) =>
  <Router history={history} routes={routes(store)} />;
