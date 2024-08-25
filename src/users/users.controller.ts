import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ApiOkResponsePaginated } from '@/dto/paginated.dto';

import { CreateUserDto, FindUserDto, UpdateUserDto, User } from './dtos';
import { UsersService } from './users.service';

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
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  @ApiOkResponse({
    description: 'Returns user',
    type: User,
  })
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserByUserId(id);
  }

  @Get('/auth0/:auth0Id')
  @ApiOperation({
    summary: 'Get user by Auth0 ID',
    description: 'Returns user',
  })
  @ApiParam({ type: 'string', name: 'auth0Id', example: 'auth0|1234567890' })
  @ApiOkResponse({
    description: 'Returns user',
    type: User,
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

  @Post('')
  @ApiOperation({
    summary: 'creates a new user',
    description: 'creates a new user',
  })
  @ApiOkResponse({
    description: 'created user',
    type: User,
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put('')
  @ApiOperation({
    summary: 'updates a new user',
    description: 'updates a new user',
  })
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }

  @Get(':userId/forms')
  @ApiOperation({
    summary: 'Get all forms for a user',
    description: 'Returns all forms associated with the specified user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user whose forms are to be retrieved',
    example: '12345',
  })
  async findAllFormsByUser(
    @Param('userId') userId: string,
    @Query() queryParams: FindUserDto,
  ) {
    return this.usersService.findAllFormsByUser(userId, queryParams);
  }
}
