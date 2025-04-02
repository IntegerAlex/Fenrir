import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { ContainerModule } from './container/container.module';
import { DeploymentModule } from './deployment/deployment.module';
import { DatabaseModule } from './db/database.module';
import { RedisModule } from './redis/redis.module';
import { SubdomainModule } from './subdomain/subdomain.module';
import { HtmxModule } from './htmx/htmx.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    ContainerModule,
    DeploymentModule,
    DatabaseModule,
    SubdomainModule,
    HtmxModule,
  ],
})
export class AppModule {}
