import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { ContainerModule } from './container/container.module';
import { DeploymentModule } from './deployment/deployment.module';
import { DatabaseModule } from './db/database.module';
import { SubdomainModule } from './subdomain/subdomain.module';
import { HtmxModule } from './htmx/htmx.module';
import * as path from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/home/akshat/projects/cloudRun/frontend/dist', // Path to your frontend directory
    }),
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
