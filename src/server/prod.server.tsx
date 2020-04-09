import path from 'path';
import compression from 'compression';
import express, { Application, Request, Response } from 'express';

const app: Application = express();
const port = process.env.PORT || 8081;

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(compression());

app.get('/', (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fragment = require('./public/fragment.json');
  res.json(fragment);
})

app.listen(port, () => {
  console.info(`Web server listening on port ${port}`);
});