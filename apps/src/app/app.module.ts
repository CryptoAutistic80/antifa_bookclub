import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { backendEnvSchema } from '@antifa-bookclub/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (env) => backendEnvSchema.parse(env),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') ?? 'mongodb://localhost:27017/antifa-bookclub',
        serverSelectionTimeoutMS: 500,
        autoCreate: false,
        autoIndex: false,
      }),
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
