import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.userService.createUser(username, password);
  }

  @Get('subscription')
  async getSubscription(@Query('username') username: string) {
    return this.userService.trackDeployment(username);
  }
}
