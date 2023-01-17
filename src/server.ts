import express from 'express';
import router from './lib/router';
import path from 'path';
import cookieParser from 'cookie-parser';

const { PORT = 3001 } = process.env;

const app = express();

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Middleware to set userId Cookie on request (to fake authentication)
app.use(cookieParser());

// Serve API requests from the router
app.use('/api/', router);

// Serve app production bundle
app.use(express.static('dist/app'));

// Handle client routing, return all requests to the app
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
