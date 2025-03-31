import express from 'express';
import cookieParser from 'cookie-parser'; // Added cookie-parser import
import { runContainer, createImage } from './containerServices';
import htmxRouter from './routes/htmx';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
require('dotenv').config();
import { createDirectory } from './utils/containerUtil';
import database from '../db/main';
import { exec } from 'child_process';

const app = express();

// Add cookie-parser middleware before any routes that use cookies
app.use(cookieParser());
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/htmx', htmxRouter);
app.use(express.static(path.join(__dirname, '../../frontend/')));

// Health Check
app.get('/v1/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Endpoint to run container
app.post('/v1/runContainer', async (req, res) => {
  const {
    userName,
    projectName,
    repoLink,
    entryPoint,
    buildCommand = 'npm install',
    runCommand = 'node',
  } = req.body as {
    userName: string;
    projectName: string;
    repoLink: string;
    entryPoint: string;
    buildCommand?: string;
    runCommand?: string;
  };

  const missingFields = [];
  if (!userName) missingFields.push('userName');
  if (!projectName) missingFields.push('projectName');
  if (!repoLink) missingFields.push('repoLink');
  if (!entryPoint) missingFields.push('entryPoint');

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      fields: missingFields,
    });
  }

  try {
    const imageName = await createImage(
      userName,
      projectName,
      repoLink,
      entryPoint,
      buildCommand,
      runCommand
    );
    const containerId = await runContainer(userName, projectName);

    await database.dbRedisSet(userName.toLowerCase(), true);
    res.json({
      containerId,
      imageName,
      status: 'deployed',
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Deployment error: ${err.message}`);
      res.status(500).json({
        error: 'Deployment failed',
        message: err.message,
      });
    } else {
      console.error('Deployment error: Unknown error');
      res.status(500).json({
        error: 'Deployment failed',
        message: 'Unknown error occurred',
      });
    }
  }
});

// In-memory session storage
const sessions: { [key: string]: { username: string; createdAt: number } } = {};

// Simple session ID generator
function generateSessionId(): string {
  return Math.random().toString(36).substring(2);
}

const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes expiry

// Login route that sets a cookie with the session ID
app.post('/login', (req, res) => {
  const { githubUsername, passKey } = req.body;

  if (passKey === process.env.PASS_KEY) {
    createDirectory(githubUsername);
    const sessionId = generateSessionId();
    sessions[sessionId] = { username: githubUsername, createdAt: Date.now() };
    res.cookie('sessionId', sessionId, { httpOnly: true, secure: false });
    console.log('Session ID set:', sessionId);
    res.status(200).json({ message: 'Login successful', githubUsername });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Middleware to check authentication
const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const sessionId = req.cookies?.sessionId;
  console.log('Session ID:', sessionId);

  if (!sessionId) {
    console.log('No session ID found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const session = sessions[sessionId];
  if (!session) {
    console.log('Session not found for ID:', sessionId);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sessionAge = Date.now() - session.createdAt;

  if (sessionAge > SESSION_EXPIRY_MS) {
    console.log('Session expired:', sessionId);
    delete sessions[sessionId];
    return res
      .status(401)
      .json({ message: 'Session expired. Please log in again.' });
  } else {
    (req as any).user = { username: session.username };
    console.log('User authenticated:', session.username);
    next();
  }
};

// Protected route example
app.get('/protected-route', isAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// /home route serving home.html
app.get('/home', (req, res) => {
  console.log('User accessed /home');
  res.sendFile(path.join(__dirname, '../../frontend/home.html'));
});

// Callback route
app.get('/callback', (req, res) => {
  console.log(req.oidc?.user);
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Extend Request interface for oidc (if used)
declare global {
  namespace Express {
    interface Request {
      oidc?: {
        user: {
          nickname: string;
        };
      };
    }
  }
}

// Profile route with authentication
app.get(
  '/v1/profile',
  isAuthenticated,
  (req: express.Request, res: express.Response) => {
    console.log('User accessed /profile');
    res.json({ nickname: (req as any).user.username });
  }
);

// Route to fetch GitHub repositories
app.get('/v1/repositories', (req: express.Request, res: express.Response) => {
  const user_id = req.query.user_id as string;

  fetch(`https://api.github.com/users/${user_id}/repos`, { method: 'GET' })
    .then((response) => response.json())
    .then((data: any) => {
      const repositories = data.map(
        (repo: { name: string; html_url: string }) => ({
          name: repo.name,
          url: repo.html_url,
        })
      );
      res.send({
        repositories: repositories,
        avatar_url: data[0]?.owner?.avatar_url,
      });
    })
    .catch((error) => {
      console.error('Error fetching repositories:', error);
      res.status(500).send('Error fetching repositories');
    });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  }
);

// Request logging middleware
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  }
);

// Route to serve the login page
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../../frontend/login.html');
  console.log('Login file path:', filePath);
  res.sendFile(filePath);
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
