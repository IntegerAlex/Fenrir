// src/container/container.module.ts
import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';
import { SubdomainService } from '../subdomain/subdomain.service';
import { DeploymentModule } from '../deployment/deployment.module';

@Module({
  imports: [DeploymentModule],
  providers: [ContainerService, SubdomainService],
  controllers: [ContainerController],
})
export class ContainerModule {}
