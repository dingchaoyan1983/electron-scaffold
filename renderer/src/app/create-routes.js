import React from 'react';
import { Router } from 'react-router';
import Layout from './containers/layout';

const routes = () => [
  {
    path: '/',
    component: () => <Layout />,
  },
];

export default (history, store) =>
  <Router history={history} routes={routes(store)} />;
