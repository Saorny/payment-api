import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from '../../database/entities/customer';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LoginInfo } from './dto/login-info.dto';
import { LoginResponseInfoDto } from './dto/login-response-info.dto';
import { SubscribeCustomerDto } from './dto/subscribe-customer.dto';
import { BasicInfoDto } from './dto/basic-info.dto';
import { CustomerAuthGuard } from 'src/guards/customer-auth-guard';
import { AuthCustomer } from 'src/auth/data.interface';
import { Request } from 'express';

@Controller('customers')
@ApiTags('Customer')
@ApiOkResponse()
@ApiUnauthorizedResponse()
export class CustomerController {
  public constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard, CustomerAuthGuard)
  @Get('info')
  @ApiOperation({ summary: 'Register a customer' })
  @ApiOkResponse({
    type: BasicInfoDto,
  })
  @ApiUnauthorizedResponse()
  public async retrieveCustomerInfo(
    @Req() req: Request,
  ): Promise<BasicInfoDto | undefined> {
    return this.customerService.retrieveInfo(req.user as AuthCustomer);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a customer' })
  @ApiOkResponse({
    type: LoginResponseInfoDto,
  })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: LoginInfo })
  public async loginCustomer(
    @Body() info: LoginInfo,
  ): Promise<LoginResponseInfoDto | undefined> {
    return this.customerService.login(info);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a customer' })
  @ApiOkResponse({
    type: Customer,
  })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: SubscribeCustomerDto })
  public async registerCustomer(
    @Body() info: SubscribeCustomerDto,
  ): Promise<Customer | undefined> {
    return this.customerService.registerNewCustomer(info);
  }
}
