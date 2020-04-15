import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const GLOBAL_STATE = {};

ReactDOM.render(<App state={GLOBAL_STATE} />, document.getElementById('root'))
 