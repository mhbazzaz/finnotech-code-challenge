import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

const version = '1.0.0';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const port = configService.get<number>('PORT');

  const options = new DocumentBuilder()
    .setTitle('Finnotech Code-Challenge')
    .setDescription('API Specification For Finnotech Code-Challenge')
    .addBearerAuth()
    .addSecurity('Authorization', {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer {your_access_token_here}',
    })
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('documentations', app, document);

  await app.listen(port);
  const appUrl = await app.getUrl();

  console.table({
    app_status: 'Running',
    app_version: version,
    app_address: appUrl,
    swagger_address: `${appUrl}/documentations`,
  });
}
bootstrap();
