// src/deployment/deployment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { Deployment } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment])],
  providers: [DeploymentService],
  controllers: [DeploymentController],
})
export class DeploymentModule {}
