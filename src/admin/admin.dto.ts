import { IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class AddClientDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(5)
  password: string;
}
