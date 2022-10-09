import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubscribeCustomerDto {
  @ApiProperty({
    description: 'customer name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'customer phone number',
  })
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({
    description: 'customer email',
  })
  @IsString()
  readonly email: string;
}
