import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto, FindUserDto, UpdateUserDto, User } from './dtos';
import { UsersService } from './users.service';
import { ApiOkResponsePaginated } from '@/helpers/pagination';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns user',
  })
  @ApiParam({
    type: 'string',
    name: 'id',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Returns user',
    type: User,
  })
  findUserById(@Param('id') id: bigint) {
    return this.usersService.findUserById(id);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns user list',
  })
  @ApiOkResponsePaginated(User)
  findAll(@Query() queryParams: FindUserDto) {
    return this.usersService.findAll(queryParams);
  }

  @Post('')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user',
  })
  @ApiOkResponse({
    description: 'Created user',
    type: User,
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put('')
  @ApiOperation({
    summary: 'Update an existing user',
    description: 'Updates user details',
  })
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }
}