import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CustomerAuthGuard } from 'src/guards/customer-auth-guard';
import { AuthCustomer } from 'src/auth/data.interface';
import { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/database/entities/order.entity';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { IdemPotentGuard } from 'src/guards/idempotent';

@Controller('orders')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @UseGuards(JwtAuthGuard, CustomerAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve customer orders' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @ApiQuery({
    name: 'type',
    enum: ['all', 'prepayment', 'receive', 'finished', 'cancelled'],
  })
  public async getOrders(@Req() req: Request): Promise<any[] | undefined> {
    return this.ordersService.getOrders(req.user as AuthCustomer);
  }

  @UseGuards(JwtAuthGuard, CustomerAuthGuard, IdemPotentGuard)
  @Post()
  @ApiOperation({ summary: 'Submit Order' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @ApiBody({ type: CreateOrderDto })
  public async submitOrder(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order | undefined> {
    return this.ordersService.submitOrder(
      req.user as AuthCustomer,
      createOrderDto,
    );
  }

  @UseGuards(JwtAuthGuard, CustomerAuthGuard)
  @Post('payment')
  @ApiOperation({ summary: 'Pay for an order' })
  @ApiCreatedResponse()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @ApiBody({ type: PaymentOrderDto })
  public async payForOrder(
    @Req() req: Request,
    @Body() paymentOrderDto: PaymentOrderDto,
  ): Promise<any> {
    return this.ordersService.payForOrder(
      req.user as AuthCustomer,
      paymentOrderDto,
    );
  }
}
