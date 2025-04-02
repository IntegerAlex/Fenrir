// src/deployment/deployment.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { DeploymentService } from './deployment.service';

@Controller('deployment')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Get()
  async getDeployments(@Query('userName') userName: string) {
    return this.deploymentService.getDeployments(userName);
  }
}
