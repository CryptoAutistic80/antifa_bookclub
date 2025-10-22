import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loadBackendConfig } from '@antifa-bookclub/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Antifa Bookclub API')
    .setDescription('API documentation for the Antifa Bookclub backend.')
    .setVersion('1.0.0')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const config = loadBackendConfig();
  await app.listen(config.port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${config.port}/${globalPrefix}`
  );
}

bootstrap();
