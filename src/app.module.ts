import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { ContainerModule } from './container/container.module';
import { DeploymentModule } from './deployment/deployment.module';
import { DatabaseModule } from './db/database.module';
import { SubdomainModule } from './subdomain/subdomain.module';
import { HtmxModule } from './htmx/htmx.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../frontend'), // Path to your frontend directory
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
