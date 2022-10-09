import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaymentOrderDto {
  @ApiProperty({
    description: 'Payment Method',
  })
  @IsString()
  method: string;

  @ApiProperty({
    description: 'Payment Code',
  })
  @IsString()
  transactionCode: string;

  @ApiProperty({
    description: 'Order Id',
  })
  @IsString()
  orderId: string;
}
