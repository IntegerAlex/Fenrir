import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService globally available
      envFilePath: ['.env'], // Load environment variables from .env
    }),
  ],
  providers: [ConfigService], // Register ConfigService as a provider
  exports: [ConfigService], // Export ConfigService for use in other modules
})
export class ConfigModule {}
