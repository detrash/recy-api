import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns user',
  })
  findUserByUserId(@Param('id') id: string) {
    return this.usersService.findUserByUserId(id);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns user',
  })
  findAll() {
    return this.usersService.findAll();
  }
}
