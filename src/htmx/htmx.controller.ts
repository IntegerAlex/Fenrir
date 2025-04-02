// src/htmx/htmx.controller.ts
import { Controller, Post, Get, Query, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { HtmxService } from './htmx.service';

@Controller('htmx')
export class HtmxController {
  constructor(private readonly htmxService: HtmxService) {}

  @Post()
  async runContainer(@Body() body: any, @Res() res: Response) {
    const { userName, buildCommand, runCommand, repoLink, entryPoint } = body;
    try {
      const result = await this.htmxService.runContainer(userName, repoLink, entryPoint, buildCommand, runCommand);
      res.send(`<p>Container ID: ${result.containerId}</p>`);
    } catch (error) {
      console.error('Error:', error);
      res.send('<p>Error deploying container</p>');
    }
  }

  @Get('deployments')
  async getDeployments(@Query('userName') userName: string, @Res() res: Response) {
    try {
      const deployments = await this.htmxService.getDeployments();
      if (!deployments || deployments.length === 0) {
        return res.send('<p>No deployments found</p>');
      }
      const deploymentsHTML = deployments
        .map((deployment) => `
          <div class="deployment-item">
            <h3>${deployment.projectName}</h3>
            <p>Status: ${deployment.status}</p>
            <p>Deployed at: ${new Date(deployment.time).toLocaleString()}</p>
            <p>Deployment ID: ${deployment.containerId}</p>
          </div>
        `)
        .join('');
      res.send(`
        <div class="deployments-container">
          ${deploymentsHTML}
        </div>
      `);
    } catch (error) {
      console.error('Error fetching deployments:', error);
      res.send('<p>Error fetching deployments</p>');
    }
  }

  @Get('subscription')
  async getSubscription(@Query('userName') userName: string, @Res() res: Response) {
    try {
      const subscription = await this.htmxService.getSubscription(userName.toLowerCase());
      if (subscription) {
        res.send(`<p>You are in free tier</p><p>Upgrade to premium to get more deployments</p>`);
      } else {
        res.send(`<p>You are in free tier</p><p>You can deploy one application</p>`);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.send('<p>Error fetching subscription</p>');
    }
  }
}
