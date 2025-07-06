import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsUnique } from '../../common/validation/is-unique.constraint';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Validate(IsUnique, ['user', 'email'])
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
