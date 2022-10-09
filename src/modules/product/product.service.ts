import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { In, Repository, UpdateResult } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { AddProductDto } from './dto/add-product.dto';
import { BaseService } from '../common/base-service';
import { CacheService } from '../cache/cache.service';
import { ProductInfoDto } from './dto/product-info.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { ItemToCheckDto } from '../order/dto/create-order.dto';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    protected readonly cacheService: CacheService,
  ) {
    super(productRepository, 'all', 'services/products', cacheService);
  }

  public getProductsBySkuIds(
    skuIds: string[],
    relations?: string[],
  ): Promise<Product[]> {
    const where = {
      skuId: In(skuIds),
    };

    return this.search({ where, relations });
  }

  public async retrieveProductList(): Promise<ProductInfoDto[]> {
    const products = await this.search({});

    return products.map((p: Product) => {
      return {
        skuId: p.skuId,
        skuName: p.skuName,
        price: p.price,
        description: p.description,
        quantity: p.quantity,
      };
    });
  }

  public addProduct(info: AddProductDto): Promise<Product> {
    const product = new Product(
      info.skuId,
      info.skuName,
      info.price,
      info.description,
      info.quantity,
    );

    return this.save(product);
  }

  public updateProductQuantity(
    productId: string,
    info: UpdateQuantityDto,
  ): Promise<UpdateResult> | null {
    return this.update({ id: productId }, { quantity: info.quantity });
  }

  public async decreaseInventory(items: ItemToCheckDto[]): Promise<any> {
    return items.map(async (i: ItemToCheckDto) => {
      const product = await this.searchOne({ skuId: i.skuId });

      if (product) {
        product.quantity -= i.quantity;
        await this.save(product);
      }
    });
  }
}
