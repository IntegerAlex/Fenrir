// src/subdomain/subdomain.module.ts
import { Module } from '@nestjs/common';
import { SubdomainService } from './subdomain.service';
import { SubdomainController } from './subdomain.controller';

@Module({
  providers: [SubdomainService],
  controllers: [SubdomainController],
  exports: [SubdomainService], // Export SubdomainService if needed in other modules
})
export class SubdomainModule {}
