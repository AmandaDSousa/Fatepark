import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common';

import { AppService } from './app.service';
import {LocalAuthGuard} from "./local.guard";
import {AuthService} from "./auth.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
