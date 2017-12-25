import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  withHandlers,
  withProps,
} from 'recompose';

export default compose(
  connect(null, {}),
)(({
  registerRef,
  handlers,
}) => (
  <div ref={registerRef}>base111 layout</div>
));