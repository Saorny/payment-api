import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { AddProductDto } from './dto/add-product.dto';
import { Product } from 'src/database/entities/product.entity';
import { ProductInfoDto } from './dto/product-info.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { UpdateResult } from 'typeorm';

@Controller('products')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Product List' })
  @ApiOkResponse()
  @ApiBody({ type: ProductInfoDto })
  @ApiUnauthorizedResponse()
  public async retrieveProducts(): Promise<ProductInfoDto[]> {
    return this.productsService.retrieveProductList();
  }

  @Post()
  @ApiOperation({ summary: 'Add One Product' })
  @ApiOkResponse()
  @ApiBody({ type: AddProductDto })
  @ApiUnauthorizedResponse()
  public async updateProduct(@Body() info: AddProductDto): Promise<Product> {
    return this.productsService.addProduct(info);
  }

  @Patch(':productId/update-quantity')
  @ApiOperation({ summary: 'Add One Product' })
  @ApiOkResponse()
  @ApiBody({ type: UpdateQuantityDto })
  @ApiUnauthorizedResponse()
  public async updateProductQuantity(
    @Param('productId') productId: string,
    @Body() info: UpdateQuantityDto,
  ): Promise<UpdateResult | null> {
    return this.productsService.updateProductQuantity(productId, info);
  }
}
