import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../modules/shared/service/applogger.service';
import { Seeder } from '../../modules/common/seeder.service';
import { dataToSeed, ProductSeederInterface } from './data';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class ProductSeederService extends Seeder<Product> {
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
      dataToSeed.map(async (data: ProductSeederInterface) => {
        const product = new Product(
          data.skuId,
          data.skuName,
          data.price,
          data.description,
          data.quantity,
        );

        this.logger.log(`Seeding Product | Info ${JSON.stringify(product)}`);
        return this.save(product);
      }),
    );
    return products;
  }
}
