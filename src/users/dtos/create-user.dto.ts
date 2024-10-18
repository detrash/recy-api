import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString,Validate } from 'class-validator';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { ProfileType } from './user.dto';
import { userSchema } from '../../schema/validation.schemas';
@InputType()
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Validate(ZodValidationPipe, [userSchema.shape.authUserId])
  @ApiProperty({
    example: 'google-oauth2|104364323610927340190',
  })
  @Field({ description: 'Auth0 User ID' })
  authUserId: string;

  @IsNotEmpty()
  @IsString()
  @Validate(ZodValidationPipe, [userSchema.shape.name])
  @ApiProperty({
    example: 'Jhon Doe',
  })
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Validate(ZodValidationPipe, [userSchema.shape.email])
  @ApiProperty({
    example: 'jhon@example.com',
  })
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Validate(ZodValidationPipe, [userSchema.shape.phoneNumber])
  @ApiProperty({
    example: '2223334444',
  })
  @Field()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Validate(ZodValidationPipe, [userSchema.shape.profileType])
  @Field(() => ProfileType)
  profileType: ProfileType;
}
