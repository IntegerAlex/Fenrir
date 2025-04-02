// src/container/container.service.ts
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createDirectory , getPort } from '../utils/container.util';
import { DeploymentService } from '../deployment/deployment.service';
import { SubdomainService } from '../subdomain/subdomain.service';

const execAsync = promisify(exec);

@Injectable()
export class ContainerService {
  constructor(
    private readonly deploymentService: DeploymentService,
    private readonly subdomainService: SubdomainService,
  ) {}

  async runContainer(body: any) {
    const { userName, projectName, repoLink, entryPoint, buildCommand, runCommand } = body;
    
    const imageName = `${userName.toLowerCase()}-${projectName}`;
    const port = await getPort(8081);

    await this.createImage(userName, projectName, repoLink, entryPoint, buildCommand, runCommand);
    const { stdout } = await execAsync(`podman run -d -p ${port}:8080 -t localhost/${imageName}:latest`);

    const containerId = stdout.trim();
    await this.subdomainService.setupSubdomain(containerId.substring(0, 12), port, containerId);

    return { containerId, imageName, status: 'deployed' };
  }

  private async createImage(userName: string, projectName: string, repoLink: string, entryPoint: string, buildCommand: string, runCommand: string) {
    const linuxUser = process.env.LINUX_USER || 'root';
    const userDirPath = `/home/${linuxUser}/${userName.toLowerCase()}`;
    const projectDirPath = `${userDirPath}/${projectName}`;
    
    createDirectory(userName);
    
    // Clone the repository without changing the process directory
    await execAsync(`git clone ${repoLink} ${projectDirPath}`);
    
    // Create a Dockerfile using the provided parameters
    const dockerfile = [
      'FROM node:16',
      `WORKDIR /app`,
      'COPY . /app/',
      `RUN ${buildCommand}`,
      `EXPOSE 8080`,
      `CMD ${runCommand} ${entryPoint}`
    ].join('\n');
    
    // Write Dockerfile to the project directory
    await execAsync(`echo '${dockerfile}' > ${projectDirPath}/Dockerfile`);
    
    // Build the image
    await execAsync(`buildah build -t ${userName.toLowerCase()}-${projectName} ${projectDirPath}`);
  }
}
