// src/htmx/htmx.service.ts
import { Injectable } from '@nestjs/common';
import { DeploymentService } from '../deployment/deployment.service';

@Injectable()
export class HtmxService {
  constructor(private readonly deploymentService: DeploymentService) {}

  async runContainer(
    userName: string,
    repoLink: string,
    entryPoint: string,
    buildCommand?: string,
    runCommand?: string
  ) {
    const projectName = repoLink.split('/').pop()?.split('.')[0] || '';
    const response = await fetch('http://localhost:8080/v1/runContainer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName,
        projectName,
        repoLink,
        buildCommand: buildCommand || 'npm install',
        runCommand: runCommand || 'node',
        entryPoint,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error occurred');
    }

    return response.json();
  }

  async getDeployments() {
    return this.deploymentService.getDeployments();
  }

  async getSubscription(userName: string) {
    return true;
  }
}
