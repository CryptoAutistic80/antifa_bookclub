import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductController } from './controller/product.controller';
import { ProductRepository } from './repository/product.repository';
import { ProductService } from './service/product.service';
import { PRODUCT_MODEL, ProductSchema } from './schema/product.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PRODUCT_MODEL, schema: ProductSchema }])],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
