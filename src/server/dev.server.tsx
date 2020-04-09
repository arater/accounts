import path from 'path';
import http from 'http';
import express, { Application, Request, Response } from 'express';
import reload from 'reload';
import pkg from '../../package.json';
import ReactBodyStream from './app';

const app: Application = express();
const port = process.env.PORT || 8081;

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
</body>

</html>
`
};

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')

  res.write(layout.head);

  ReactBodyStream.on('data', chunk => res.write(chunk));

  ReactBodyStream.on('error', err => {
    console.error('react render error:', err)
  });

  ReactBodyStream.on('end', () => {
    res.write(layout.foot)
    res.end()
  });
});

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.info(`Web server listening on port ${port}`)
});