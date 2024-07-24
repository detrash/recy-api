import { Field, InputType } from '@nestjs/graphql';

import { ProfileType } from './user.dto';

@InputType()
export class CreateUserDto {
  authUserId: string;

  @Field()
  name: string;

  @Field(() => ProfileType)
  profileType: ProfileType;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;
}
