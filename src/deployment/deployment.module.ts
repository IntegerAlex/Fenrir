// src/deployment/deployment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { Deployment } from './deployment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment])],
  providers: [DeploymentService],
  controllers: [DeploymentController],
  exports: [DeploymentService],
})
export class DeploymentModule {}
