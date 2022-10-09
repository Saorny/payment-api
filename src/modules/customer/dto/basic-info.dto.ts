import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BasicInfoDto {
  @ApiProperty({
    description: 'email',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '细节',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'id',
  })
  @IsString()
  id: string;
}
