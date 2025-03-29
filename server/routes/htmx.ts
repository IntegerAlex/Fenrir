import express, { Request, Response } from 'express';
import path from 'path';
import { getDeployments } from '../../db/operations';
import database from '../../db/main';

const router = express.Router();

// Define the request body type for the POST route
interface RunContainerRequestBody {
  userName: string;
  buildCommand?: string;
  runCommand?: string;
  repoLink: string;
  entryPoint?: string;
}

// Define the response type for the runContainer API call
interface RunContainerResponse {
  containerId: string;
}

// Define the deployment type
interface Deployment {
  id: string;
  project_name: string;
  status: string;
  time: string;
  container_id: string;
}

// Define the error response type
interface ErrorResponse {
  message?: string;
}

router.post('/', async (req: Request, res: Response) => {
  const { userName, buildCommand, runCommand, repoLink, entryPoint }: RunContainerRequestBody = req.body;
  const projectName = repoLink.split('/').pop()?.split('.')[0] || '';

  try {
    const redisData = await database.dbRedisGet(userName.toLowerCase());
    if (redisData) {
      // Uncomment if you want to limit deployments
      // return res.send(`<p>Deployments limit reached</p>`);
    }

    console.log(projectName, repoLink, entryPoint);
    const response = await fetch('http://localhost:8080/v1/runContainer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        projectName,
        repoLink,
        buildCommand: buildCommand || 'npm install',
        runCommand: runCommand || 'node',
        entryPoint,
      }),
    });

    // Check if the response is OK and parse the JSON
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Handle potential JSON parsing errors
      console.error('Error response:', errorData);
      return res.status(response.status).json({ message: (errorData as ErrorResponse).message || 'Error occurred' });
    }

    const runContainerData: RunContainerResponse = await response.json() as RunContainerResponse; // Assert the type of runContainerData
    const containerId = runContainerData.containerId; // Now TypeScript knows this is safe
    res.send(`<p>Container ID: ${containerId}</p>`);
  } catch (error) {
    console.error('Error:', error);
    res.send('Error');
  }
});

//db.addContainer(containerId , projectName , repoLink , entryPoint)

//res.send("<p>Deploying... please Wait</p>");

router.get('/deployments', async (req: Request, res: Response) => {
  try {
    const userName = req.query.userName as string;
    console.log(userName.toLowerCase());
    //const data = await response.json();
    //
    //
    //
    //	const userName = data.nickname;

    const deployments: Deployment[] = await getDeployments(userName.toLowerCase());
    if (!deployments || deployments.length === 0) {
      return res.send('<p>No deployments found</p>');
    }

    const deploymentsHTML = deployments
      .map((deployment) => {
        return `
                <div class="deployment-item">
                    <h3>${deployment.project_name}</h3>
                    <p>Status: ${deployment.status}</p>
                    <p>Deployed at: ${new Date(deployment.time).toLocaleString()}</p>
                    <p>Deployment ID: ${deployment.container_id}</p>
                </div>
            `;
      })
      .join('');

    res.send(`
            <div class="deployments-container">
                ${deploymentsHTML}
            </div>
        `);
  } catch (error) {
    console.error('Error fetching deployments:', error);
    res.send('<p>Error fetching deployments</p>');
  }
});

router.get('/subscription', async (req: Request, res: Response) => {
  console.log('subscription');
  const userName = req.query.userName as string;
  try {
    const data = await database.dbRedisGet(userName.toLowerCase());
    if (data) {
      res.send(`<p>You are in free tier</p>
				 <p>Upgrade to premium to get more deployments</p>`);
    } else {
      res.send(`<p>You are in free tier</p>
				 <p>You can deploy one application</p>`);
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.send('<p>Error fetching subscription</p>');
  }
});

export default router;
