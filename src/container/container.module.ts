// src/container/container.module.ts
import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';

@Module({
  providers: [ContainerService],
  controllers: [ContainerController],
})
export class ContainerModule {}
