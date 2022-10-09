import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemToCheckDto {
  @ApiProperty({
    description: '商品skuId',
  })
  @IsString()
  skuId: any;

  @ApiProperty({
    description: '商品数量',
  })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'address',
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    isArray: true,
    description: 'list of items',
    type: ItemToCheckDto,
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ItemToCheckDto)
  products: ItemToCheckDto[];
}
