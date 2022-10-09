import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProductInfoDto {
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
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Quantity',
  })
  @IsNumber()
  quantity: number;
}
