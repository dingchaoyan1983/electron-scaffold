import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
} from 'recompose';

export default compose(
  connect(null, {}),
)(() => (
  <div>base layout</div>
));
