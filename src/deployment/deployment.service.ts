// src/deployment/deployment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deployment } from './deployment.entity';

@Injectable()
export class DeploymentService {
  constructor(
    @InjectRepository(Deployment)
    private readonly deploymentRepository: Repository<Deployment>,
  ) {}

  async getDeployments() {
    return this.deploymentRepository.find();
  }

  async addDeployment(projectName: string, containerId: string) {
    const deployment = new Deployment();
    deployment.projectName = projectName;
    deployment.status = 'deployed';
    deployment.time = new Date();
    deployment.containerId = containerId;
    await this.deploymentRepository.save(deployment);
  }
}
