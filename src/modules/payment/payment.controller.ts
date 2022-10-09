import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@Controller('depositpayments')
@ApiTags('DepositPayment')
export class PaymentController {
  constructor(private readonly depositPaymentsService: PaymentService) {}
}
