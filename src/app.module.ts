import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { SupplyModule } from './supply/supply.module.js';
import { OrderModule } from './order/order.module.js';
import { DealerModule } from './dealer/dealer.module.js';
import { ClientModule } from './client/client.module.js';
import { DatabaseModule } from './database/database.module.js';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/filters/all-exeptions.filters.js';
import { LoggingMiddleware } from './shared/middleware/global.middleware.js';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor.js';
import { DeliveryModule } from './delivery/delivery.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
        PORT: Joi.number().default(3000),
        DB_URL: Joi.string().uri().required(),
        DB_SYNC: Joi.number().valid(0, 1).default(0),
        JWT_SECRET: Joi.string().min(32).required(),
      }),
    }),
    SupplyModule,
    OrderModule,
    DealerModule,
    ClientModule,
    DatabaseModule,
    DeliveryModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(LoggingMiddleware)
    .forRoutes('*')
  }
}
