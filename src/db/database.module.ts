// src/db/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from '../deployment/deployment.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST || 'localhost',
      port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
      username: process.env.PG_USERNAME || 'postgres',
      password: process.env.PG_PASSWORD || 'password',
      database: process.env.PG_DATABASE || 'flexhost',
      entities: [Deployment],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
