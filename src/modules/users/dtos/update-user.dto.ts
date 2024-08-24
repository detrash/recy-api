import { InputType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {}
