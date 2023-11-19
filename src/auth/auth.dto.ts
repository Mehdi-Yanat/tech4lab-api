import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(5)
  password: string;
}
