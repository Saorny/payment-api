import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginResponseInfoDto {
  @ApiProperty({
    description: 'id',
  })
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: 'name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'email',
  })
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: 'phoneNumber',
  })
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({
    description: 'token',
  })
  @IsString()
  readonly token: string;
}
