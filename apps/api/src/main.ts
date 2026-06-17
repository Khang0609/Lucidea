/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import authRoutes from './routes/auth.routes';

const app = express();

// Enable JSON parser for requests
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/auth', authRoutes);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

const port = process.env.PORT || 3333;
const host = process.env.HOST || '0.0.0.0';
const server = app.listen(Number(port), host, () => {
  console.log(`Listening at http://${host}:${port}/api`);
});
server.on('error', console.error);
