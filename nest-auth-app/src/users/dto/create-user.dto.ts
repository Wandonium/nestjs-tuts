import { IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}
