import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({ description: 'Unique identifier for the product', example: 'prod-1' })
  @IsString()
  @IsNotEmpty()
  readonly id!: string;

  @ApiProperty({ description: 'Display name of the product', example: 'Anti-Fascist Handbook' })
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'A practical guide to anti-fascist organizing.',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ description: 'Price of the product', example: 24.99 })
  @IsNumber()
  @Min(0)
  readonly price!: number;

  @ApiProperty({ description: 'ISO-4217 currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  readonly currency!: string;

  @ApiProperty({
    description: 'Public image URL for the product',
    example: 'https://cdn.antifa-bookclub.org/products/antifa-handbook.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  readonly imageUrl?: string;

  @ApiProperty({ description: 'Categorisation tags for the product', example: ['books', 'education'] })
  @IsArray()
  @IsString({ each: true })
  readonly tags!: string[];

  @ApiProperty({ description: 'When the product record was created' })
  @Type(() => Date)
  @IsDate()
  readonly createdAt!: Date;

  @ApiProperty({ description: 'When the product record was last updated' })
  @Type(() => Date)
  @IsDate()
  readonly updatedAt!: Date;
}
