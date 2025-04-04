// src/container/container.module.ts
import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';
import { SubdomainModule } from '../subdomain/subdomain.module';
import { DeploymentModule } from '../deployment/deployment.module';

@Module({
  imports: [DeploymentModule, SubdomainModule],
  providers: [ContainerService],
  controllers: [ContainerController],
})
export class ContainerModule {}
