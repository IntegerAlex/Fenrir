import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from '../deployment/deployment.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST', 'localhost'),
        port: parseInt(configService.get('PG_PORT'), 10) || 5432,
        username: configService.get('PG_USERNAME', 'postgres'),
        password: configService.get('PG_PASSWORD', 'password'),
        database: configService.get('PG_DATABASE', 'flexhost'),
        entities: [Deployment],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
