import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginInfo {
  @ApiProperty()
  @IsString()
  email: string;
}
