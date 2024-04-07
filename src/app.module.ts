import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { OrdersModule } from './orders/orders.module';

import { EnvConfig } from './config/envConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfig ]
    }),
    OrdersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
