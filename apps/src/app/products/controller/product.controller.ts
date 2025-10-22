import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ProductDto } from '../dto/product.dto';
import { ProductService } from '../service/product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProductDto, isArray: true })
  async getProducts(): Promise<ProductDto[]> {
    const products = await this.productService.getProducts();
    return plainToInstance(ProductDto, products);
  }
}
