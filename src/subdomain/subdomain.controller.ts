// src/subdomain/subdomain.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { SubdomainService } from './subdomain.service';

@Controller('subdomain')
export class SubdomainController {
  constructor(private readonly subdomainService: SubdomainService) {}

  @Post('setup')
  async setupSubdomain(@Body() body: any, @Res() res: Response) {
    const { subdomain, port, dnsRecordId } = body;
    try {
      const result = await this.subdomainService.setupSubdomain(
        subdomain,
        port,
        dnsRecordId
      );
      res.json({ message: result });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Subdomain setup failed', message: error.message });
    }
  }
}
