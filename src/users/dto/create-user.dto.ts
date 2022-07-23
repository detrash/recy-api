import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { MessagesHelper } from '../helpers/messages.helper';
import { RegexHelper } from '../helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(RegexHelper.password, { message: MessagesHelper.PASSWORD_VALID })
  password: string;
}
