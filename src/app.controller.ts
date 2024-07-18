import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  @ApiOperation({
    summary: 'Health API',
    description: 'Returns status; Ok',
  })
  healthCheck() {
    return this.appService.healthCheck();
  }
}
