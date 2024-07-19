import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiOkResponsePaginated } from '@/dto/paginated.dto';

import { FindUserDto } from './dtos/find-user.dto';
import { User } from './dtos/user.dto';
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
  @ApiOkResponse({
    description: 'Returns deploy hash',
    type: User,
  })
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserByUserId(id);
  }

  @Get('/auth0/:auth0Id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns user',
  })
  findUserByAuth0Id(@Param('auth0Id') auth0Id: string) {
    return this.usersService.findUserByAuthUserId(auth0Id);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns user',
  })
  @ApiOkResponsePaginated(User)
  findAll(@Query() queryParams: FindUserDto) {
    return this.usersService.findAllNew(queryParams);
  }
}
