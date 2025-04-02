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
    createDirectory(userName);
    process.chdir(`/home/${process.env.LINUX_USER}/${userName.toLowerCase()}`);
    await execAsync(`git clone ${repoLink}`);
    process.chdir(projectName);
    await execAsync(`buildah build -t ${userName.toLowerCase()}-${projectName} .`);
  }
}
