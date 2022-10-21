import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../modules/shared/service/applogger.service';
import { Seeder } from '../../modules/common/seeder.service';
import { dataToSeed, CustomerSeederInterface } from './data';
import { Product } from 'src/database/entities/product.entity';
import { Customer } from 'src/database/entities/customer';

@Injectable()
export class CustomerSeederService extends Seeder<Product> {
  protected logger: AppLogger;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
    this.logger = new AppLogger('', 'product', 'seeder');
  }

  public async seed(): Promise<Product[]> {
    const products = await this.search({});

    return products.length === 0 ? this.init() : products;
  }

  protected async init(): Promise<Product[]> {
    const products: Product[] = [];

    await Promise.all(
      dataToSeed.map(async (data: CustomerSeederInterface) => {
        const customer = new Customer(data.name, data.email, data.phoneNumber);

        this.logger.log(`Seeding Customer | Info ${JSON.stringify(customer)}`);
        return this.save(customer);
      }),
    );
    return products;
  }
}
