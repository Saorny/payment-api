import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../modules/shared/service/applogger.service';
import { Seeder } from '../../modules/common/seeder.service';
import { dataToSeed, CustomerSeederInterface } from './data';
import { Customer } from 'src/database/entities/customer';

@Injectable()
export class CustomerSeederService extends Seeder<Customer> {
  protected logger: AppLogger;

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    super(customerRepository);
    this.logger = new AppLogger('', 'customer', 'seeder');
  }

  public async seed(): Promise<Customer[]> {
    const customers = await this.search({});

    return customers.length === 0 ? this.init() : customers;
  }

  protected async init(): Promise<Customer[]> {
    const customers: Customer[] = [];

    await Promise.all(
      dataToSeed.map(async (data: CustomerSeederInterface) => {
        const customer = new Customer(data.name, data.email, data.phoneNumber);

        this.logger.log(`Seeding Customer | Info ${JSON.stringify(customer)}`);
        return this.save(customer);
      }),
    );
    return customers;
  }
}
