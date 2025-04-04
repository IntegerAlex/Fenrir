import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from '../deployment/deployment.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const, // Explicitly type as "postgres"
        host: configService.get<string>('PG_HOST', 'localhost'),
        port: configService.get<number>('PG_PORT', 5444),
        username: configService.get<string>('PG_USERNAME', 'postgres'),
        password: configService.get<string>('PG_PASSWORD', 'password'),
        database: configService.get<string>('PG_DATABASE', 'flexhost'),
        entities: [Deployment],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
