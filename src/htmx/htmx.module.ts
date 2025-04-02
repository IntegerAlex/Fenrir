// src/htmx/htmx.module.ts
import { Module } from '@nestjs/common';
import { HtmxService } from './htmx.service';
import { HtmxController } from './htmx.controller';
import { DeploymentModule } from '../deployment/deployment.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [DeploymentModule, RedisModule],
  providers: [HtmxService],
  controllers: [HtmxController],
})
export class HtmxModule {}
