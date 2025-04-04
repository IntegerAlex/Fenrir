import { Injectable } from '@nestjs/common';
import { DeploymentService } from '../deployment/deployment.service';
import { SubdomainService } from '../subdomain/subdomain.service';
import { getPort, dockerFile, createDirectory } from '../utils/container.util';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

@Injectable()
export class ContainerService {
  constructor(
    private readonly deploymentService: DeploymentService,
    private readonly subdomainService: SubdomainService
  ) {}

  async runContainer(body: any) {
    const {
      userName,
      projectName,
      repoLink,
      entryPoint,
      buildCommand = 'npm install',
      runCommand = 'node',
    } = body;

    // Validate required fields
    const missingFields: string[] = []; // Explicitly type as string[]
    if (!userName) missingFields.push('userName');
    if (!projectName) missingFields.push('projectName');
    if (!repoLink) missingFields.push('repoLink');
    if (!entryPoint) missingFields.push('entryPoint');

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      // Track deployment limit
      await this.deploymentService.addDeployment(projectName, ''); // Use addDeployment instead of trackDeployment

      // Create directory for user
      createDirectory(userName);

      // Generate Dockerfile and build image
      const imageName = `${userName.toLowerCase()}-${projectName}`;
      const port = await this.findAvailablePort();
      await this.createImage(
        userName,
        projectName,
        repoLink,
        entryPoint,
        buildCommand,
        runCommand
      );

      // Run container
      const { stdout } = await execAsync(
        `podman run -d -p ${port}:8080 -t localhost/${imageName}:latest`
      );
      const containerId = stdout.trim();

      // Set up subdomain
      const subdomain = containerId.substring(0, 12);
      await this.subdomainService.setupSubdomain(subdomain, port, containerId);

      return { containerId, imageName, status: 'deployed' };
    } catch (error) {
      console.error('Error deploying container:', error);
      throw new Error('Deployment failed');
    }
  }

  private async findAvailablePort(): Promise<number> {
    // Use utility function to find an available port
    return getPort(8081);
  }

  private async createImage(
    userName: string,
    projectName: string,
    repoLink: string,
    entryPoint: string,
    buildCommand: string,
    runCommand: string
  ): Promise<void> {
    try {
      // Change directory to user folder
      process.chdir(
        `/home/${process.env.LINUX_USER || 'root'}/${userName.toLowerCase()}`
      );

      // Clone repository into project directory
      await execAsync(`git clone ${repoLink}`);
      process.chdir(projectName);

      // Check if Dockerfile exists; create if not
      try {
        await execAsync('ls Dockerfile');
        console.log('Dockerfile already exists, skipping creation.');
      } catch {
        const dockerfileContent = dockerFile(
          entryPoint,
          buildCommand,
          runCommand
        );
        await execAsync(`echo '${dockerfileContent}' > Dockerfile`);
        console.log('Dockerfile created.');
      }

      // Build Docker image
      await execAsync(
        `buildah build -t ${userName.toLowerCase()}-${projectName} .`
      );
      console.log('Docker image built successfully.');
    } catch (error) {
      console.error('Error creating Docker image:', error);
      throw error;
    }
  }
}
