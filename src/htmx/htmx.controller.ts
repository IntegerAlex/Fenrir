// src/htmx/htmx.controller.ts
import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HtmxService } from './htmx.service';
import { ConfigService } from '@nestjs/config';

@Controller('htmx')
export class HtmxController {
  public nickname: string;
  constructor(
    private readonly htmxService: HtmxService,
    private readonly configService: ConfigService
  ) {
    this.nickname = this.configService.get<string>(
      'GH_USERNAME',
      'IntegerAlex'
    );
  }

  @Post()
  async runContainer(@Body() body: any, @Res() res: Response) {
    const { userName, buildCommand, runCommand, repoLink, entryPoint } = body;
    try {
      const result = await this.htmxService.runContainer(
        userName,
        repoLink,
        entryPoint,
        buildCommand,
        runCommand
      );
      res.status(HttpStatus.OK).json({
        success: true,
        data: { containerId: result.containerId },
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Error deploying container',
      });
    }
  }

  @Get('deployments')
  async getDeployments(
    @Query('userName') userName: string,
    @Res() res: Response
  ) {
    try {
      const deployments = await this.htmxService.getDeployments();
      if (!deployments || deployments.length === 0) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'No deployments found',
        });
      }
      const formattedDeployments = deployments.map((deployment) => ({
        projectName: deployment.projectName,
        status: deployment.status,
        deployedAt: new Date(deployment.time).toLocaleString(),
        containerId: deployment.containerId,
      }));
      res.status(HttpStatus.OK).json({
        success: true,
        data: formattedDeployments,
      });
    } catch (error) {
      console.error('Error fetching deployments:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Error fetching deployments',
      });
    }
  }

  @Get('subscription')
  async getSubscription(
    @Query('userName') userName: string,
    @Res() res: Response
  ) {
    try {
      const subscription = await this.htmxService.getSubscription(
        userName.toLowerCase()
      );
      const message = subscription
        ? 'You are in free tier'
        : 'You can deploy one application';
      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          tier: 'free',
          message,
          upgrade: subscription ? 'Upgrade to premium' : null,
        },
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Error fetching subscription',
      });
    }
  }

  @Get('v1/profile')
  async getProfile(@Res() res: Response) {
    res.status(HttpStatus.OK).json({
      success: true,
      data: { nickname: this.nickname },
    });
  }

  @Get('v1/repositories')
  async getRepositories(@Res() res: Response) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${this.nickname}/repos`,
        { method: 'GET' }
      );
      const data = await response.json();
      const repositories = data.map((repo: any) => ({
        name: repo.name,
        url: repo.html_url,
      }));
      const avatarUrl = data[0]?.owner?.avatar_url;
      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          repositories,
          avatarUrl,
        },
      });
    } catch (error) {
      console.error('Error fetching repositories:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Error fetching repositories',
      });
    }
  }
}
