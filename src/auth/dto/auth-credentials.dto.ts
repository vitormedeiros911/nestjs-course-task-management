import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class AuthCredentialsDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty({ message: 'Type the name cannot be empty' })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty({ message: 'Type the password cannot be empty' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
