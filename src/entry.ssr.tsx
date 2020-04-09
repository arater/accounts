import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from './app';

const GLOBAL_STATE = {};

const sheet = new ServerStyleSheet();
const jsx = sheet.collectStyles(<App state={GLOBAL_STATE} />);
const bodyStream = sheet.interleaveWithNodeStream(ReactDOM.renderToNodeStream(jsx));

export default bodyStream;