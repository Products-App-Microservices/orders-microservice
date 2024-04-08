import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { OrdersModule } from './orders/orders.module';

import { EnvConfig } from './config/envConfig';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfig ]
    }),
    OrdersModule,
    NatsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
