import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common';

import { AppService } from '../services/app.service';
import {LocalAuthGuard} from "../guards/local.guard";
import {AuthService} from "../services/auth.service";

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
