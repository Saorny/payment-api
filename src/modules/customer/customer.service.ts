import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../../database/entities/customer';
import { LoginInfo } from './dto/login-info.dto';
import { BaseService } from '../common/base-service';
import { Formatter } from './lib/formatter';
import { AuthService } from '../../auth/auth.service';
import { CacheService } from '../cache/cache.service';
import { LoginResponseInfoDto } from './dto/login-response-info.dto';
import { SubscribeCustomerDto } from './dto/subscribe-customer.dto';
import { Encryptor } from 'src/util/encryptor.interface';
import { BasicInfoDto } from './dto/basic-info.dto';
import { AuthCustomer } from 'src/auth/data.interface';

@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    protected readonly cacheService: CacheService,
    private readonly authService: AuthService,
  ) {
    super(customerRepository, 'all', 'services/customer', cacheService);
  }

  public async getCustomerById(
    id: string,
    relations?: string[],
  ): Promise<Customer | null | undefined> {
    return this.searchOne({ id }, relations);
  }

  public findCustomerBy(
    key: string,
    value: string,
    relations?: string[],
  ): Promise<Customer | null | undefined> {
    const where = {};

    where[key] = value;
    return this.searchOne(where, relations);
  }

  public async login(
    info: LoginInfo,
  ): Promise<LoginResponseInfoDto | undefined> {
    const customer: Customer | null | undefined = await this.findCustomerBy(
      'email',
      info.email,
    );

    if (customer) {
      const token = await this.authService.generateCustomerToken(
        customer.email,
        customer.id,
      );
      const loginInfo = Formatter.formatLoginResponse(customer, token);

      this.logger.log(`Customer ${info.email} retrieves tokens`);
      return loginInfo;
    }
  }

  public async registerNewCustomer(
    info: SubscribeCustomerDto,
  ): Promise<Customer | undefined> {
    const customer = new Customer(
      info.name,
      info.email,
      Encryptor.encrypt(info.phoneNumber),
    );

    // this.logger.log(`Registering new Customer | openId ${sessionData.openid}`);
    return this.save(customer);
  }

  public async retrieveInfo(
    userInfo: AuthCustomer,
  ): Promise<BasicInfoDto | undefined> {
    const customer: Customer | null | undefined = await this.findCustomerBy(
      'email',
      userInfo.email,
    );

    if (customer) {
      return {
        email: customer.email,
        name: customer.name,
        phoneNumber: Encryptor.decrypt(customer.phoneNumber),
        id: customer.id,
      };
    }
  }
}
