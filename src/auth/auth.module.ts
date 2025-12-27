import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientModule } from '../client/client.module.js';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard.js';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './roles.guard.js';
import { OrderModule } from '../order/order.module.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './interface/user.entity.js';
import { DealerModule } from '../dealer/dealer.module.js';

@Module({
imports: [ClientModule, DealerModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      })
    }),
    MikroOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }, 
  {
    provide: APP_GUARD, 
    useClass: RolesGuard
  },
  AuthService]
})
export class AuthModule {}
