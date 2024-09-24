import { Controller, Get } from '@nestjs/common';
// import {
//   HealthCheck,
//   HealthCheckService,
//   PrismaHealthIndicator,
// } from '@nestjs/terminus';

// import { PrismaService } from '@/modules/prisma/prisma.service';

@Controller('health')
export class HealthController {
  // constructor(
  //   private health: HealthCheckService,
  //   private prismaHealth: PrismaHealthIndicator,
  //   private prisma: PrismaService,
  // ) {}

  @Get()
  async check() {
    return console.log('Health check');
  }
  // @HealthCheck()
  // check() {
  //   return this.health.check([
  //     async () => this.prismaHealth.pingCheck('prisma', this.prisma),
  //   ]);
  // }
}
