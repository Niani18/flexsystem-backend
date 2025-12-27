import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  const cfg = app.get(ConfigService);
  const orm = app.get(MikroORM);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      // Te devuelve el array completo de errores de class-validator
      return new BadRequestException(errors);
    },
  }));

   const shouldSync =
    cfg.get<string>('NODE_ENV') !== 'production' &&
    cfg.get<number>('DB_SYNC') === 1;

  if (shouldSync) {
    await orm.getSchemaGenerator().updateSchema();
  }
  
  await app.listen(cfg.get<number>('PORT') ?? 3000);


}
bootstrap();
