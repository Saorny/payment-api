import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateQuantityDto {
  @ApiProperty({
    description: 'Quantity',
  })
  @IsNumber()
  quantity: number;
}
