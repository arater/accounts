import path from 'path'
import http from 'http'
import express from 'express'
import reload from 'reload'
import reactDom from 'react-dom/server'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import pkg from '../package.json'

const app = express();
const port = process.env.PORT || 81;
let isRunningServer = false;

const GLOBAL_STATE = {
  text: 'Deneme'
};

const layout = {
  head: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pkg.name} Fragment</title>
    <script>var GLOBAL_STATE = ${JSON.stringify(GLOBAL_STATE)}</script>
</head>
<body>
    <div id="root">`,
  foot: `</div>
  <script src="${pkg.name}.js"></script>
  <script src="/reload/reload.js"></script> 
</body>
</html>
`
};

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // to transfer info ina chunked way
  res.setHeader('Transfer-Encoding', 'chunked');

  delete require.cache[require.resolve('./app')];
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Application = require('./app');

  const sheet = new ServerStyleSheet();
  // collectStyles => style ları ve içine yazılan elementleri birleştiriyor
  const jsx = sheet.collectStyles(<Application state={GLOBAL_STATE} />);
  const bodyStream = sheet.interleaveWithNodeStream(reactDom.renderToNodeStream(jsx));
  //console.log('bodyStrream', typeof bodyStream, bodyStream);
  res.write(layout.head);
  //console.log("res", res);

  bodyStream.on('data', chunk => res.write(chunk));

  bodyStream.on('error', err => {
    console.error('react render error:', err);
  });

  // Renders a view and sends the rendered HTML string to the client
  //res.render('index')

  //Sends the HTTP response, body parameter can be buffer, array, string, obj
  //res.send can only be called once, since it is equivalent to res.write + res.end()
  // res.send('<p>some html</p>')

  bodyStream.on('end', () => {
    res.write(layout.foot);
    // ends the response process
    res.end();
  });
})

const httpServer = http.createServer(app);
//httpServer.listen(port, () => console.log(`Accounts app server listening on port ${port}`));

const run = async bundler => {
  try {
    if (!isRunningServer) {
      isRunningServer = true;
      // reload process done bu reload plugin
      const reloadedServer = await reload(app);

      bundler(reloadedServer.reload);

      httpServer.listen(port, function () {
        console.info(`Web server listening on port ${port}`);
        console.log('bundler parameter', bundler);
      })
    }
  } catch (err) {
    console.error(`Reload could not start, could not start server/sample app ${pkg.name}`, err);
  }
}

export default run;