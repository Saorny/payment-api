import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/database/entities/customer';
import { Product } from 'src/database/entities/product.entity';
import { SharedModule } from 'src/modules/shared/shared.module';
import { CustomerSeederService } from './customer/customer-seeder.service';
import { ProductSeederService } from './product/product-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Customer]), SharedModule],
  controllers: [],
  providers: [ProductSeederService, CustomerSeederService],
  exports: [],
})
export class SeederModule {}
