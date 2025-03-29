import express from 'express';
import { runContainer, createImage } from './containerServices';
import htmxRouter from './routes/htmx';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
require('dotenv').config();
import { createDirectory } from './utils/containerUtil';
import database from '../db/main';
const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/htmx', htmxRouter);
app.use(express.static(path.join(__dirname, '../../frontend/')));

app.get('/v1/health', (req, res) => {
  res.status(200).send('Healthy');
});

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
    const [imageName, containerId] = await Promise.all([
      createImage(
        userName,
        projectName,
        repoLink,
        entryPoint,
        buildCommand,
        runCommand
      ),
      runContainer(userName, projectName),
    ]);

    console.log(`Container ${containerId} running with image: ${imageName}`);

    await database.dbRedisSet(userName.toLowerCase(), true);
    res.json({
      containerId,
      imageName,
      status: 'deployed',
    });
  } catch (err) {
    console.error(`Deployment error: ${err.message}`);
    res.status(500).json({
      error: 'Deployment failed',
      message: err.message,
    });
  }
});

// Add a new login route
const sessions: { [key: string]: string } = {}; // Store sessions in memory

app.post('/login', (req, res) => {
  const { githubUsername, passKey } = req.body;

  if (passKey === process.env.PASS_KEY) {
    const sessionId = generateSessionId(); // Implement a function to generate a unique session ID
    sessions[sessionId] = githubUsername; // Store the session
    res.cookie('sessionId', sessionId, { httpOnly: true }); // Set a cookie for the session
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
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const session = sessions[sessionId];
  const sessionAge = Date.now() - session.createdAt;

  // Check if session has expired
  if (sessionAge > SESSION_EXPIRY_MS) {
    delete sessions[sessionId];
    return res
      .status(401)
      .json({ message: 'Session expired. Please log in again.' });
  } else {
    // Add user data to request for use in route handlers
    (req as any).user = { username: session.username };
    next(); // User is authenticated
  }
};

// Protect routes with the authentication middleware
app.get('/protected-route', isAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route' });
});
// Update the root route
app.get('/', (req, res) => {
  console.log('Accessing root route');
  res.sendFile(path.join(__dirname, '../../frontend/home.html'));
});

app.get('/home', (req, res) => {
  console.log('User accessed /home');
  res.sendFile(path.join(__dirname, '../../frontend/home.html'));
});

app.get('/callback', (req, res) => {
  console.log(req.oidc.user);
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/v1/profile', isAuthenticated, (req: express.Request, res: express.Response) => {
  console.log('User accessed /profile');
  res.json({ nickname: (req as any).user.username });
});

app.get('/v1/repositories', (req, res) => {
  const user_id = req.query.user_id as string;

  fetch(`https://api.github.com/users/${user_id}/repos`, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
      const repositories = data.map((repo: any) => {
        return {
          name: repo.name,
          url: repo.html_url,
        };
      });
      res.send({
        repositories: repositories,
        avatar_url: data[0].owner.avatar_url,
      });
    })
    .catch((error) => {
      console.error('Error fetching repositories:', error);
      res.status(500).send('Error fetching repositories');
    });
});

// Add error handling middleware
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

// Add request logging middleware
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  }
);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
