// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
