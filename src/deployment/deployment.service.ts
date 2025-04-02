// src/deployment/deployment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deployment } from '../user/user.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DeploymentService {
  constructor(
    @InjectRepository(Deployment)
    private readonly deploymentRepository: Repository<Deployment>,
    private readonly redisService: RedisService,
  ) {}

  async getDeployments(userName: string) {
    return this.deploymentRepository.find({ where: { userName } });
  }

  async addDeployment(projectName: string, userName: string, containerId: string) {
    const deployment = new Deployment();
    deployment.userName = userName;
    deployment.projectName = projectName;
    deployment.status = 'deployed';
    deployment.time = new Date();
    deployment.containerId = containerId;
    await this.deploymentRepository.save(deployment);

    await this.redisService.set(userName.toLowerCase(), 'true');
  }

  async trackDeployment(userName: string): Promise<void> {
    const key = userName.toLowerCase();
    const existing = await this.redisService.get(key);
    if (existing) {
      throw new Error('Deployment limit reached');
    }
    await this.redisService.set(key, 'true');
  }
}
