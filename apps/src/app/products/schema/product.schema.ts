import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<ProductEntity>;

@Schema({
  collection: 'products',
  timestamps: true,
  toJSON: {
    virtuals: false,
    versionKey: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      const mutable = ret as Record<string, unknown> & { _id?: unknown };
      if (mutable._id) {
        mutable.id = mutable._id instanceof Date ? mutable._id.toISOString() : `${mutable._id}`;
        delete mutable._id;
      }
      if ('__v' in mutable) {
        delete mutable.__v;
      }
      return mutable;
    },
  },
})
export class ProductEntity {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: false, trim: true })
  description?: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, uppercase: true, minlength: 3, maxlength: 3 })
  currency!: string;

  @Prop({ required: false, trim: true })
  imageUrl?: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: Date, required: true })
  createdAt!: Date;

  @Prop({ type: Date, required: true })
  updatedAt!: Date;
}

export const PRODUCT_MODEL = ProductEntity.name;
export const ProductSchema = SchemaFactory.createForClass(ProductEntity);

ProductSchema.pre('save', function (next) {
  if (this.isNew && !this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
