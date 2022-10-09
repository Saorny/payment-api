import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddProductDto {
  @ApiProperty({
    description: 'skuId',
  })
  @IsString()
  skuId: string;

  @ApiProperty({
    description: 'Product name',
  })
  @IsString()
  skuName: string;

  @ApiProperty({
    description: 'Price',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Product description',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Quantity',
  })
  @IsOptional()
  quantity: number;
}
