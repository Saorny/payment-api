import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { SharedModule } from 'src/modules/shared/shared.module';
import { ProductSeederService } from './product/product-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SharedModule],
  controllers: [],
  providers: [ProductSeederService],
  exports: [],
})
export class SeederModule {}
