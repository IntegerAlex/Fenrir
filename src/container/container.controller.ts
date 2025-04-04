// src/container/container.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContainerService } from './container.service';

@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Post('run')
  async runContainer(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.containerService.runContainer(body);
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Deployment failed', message: error.message });
    }
  }
}
