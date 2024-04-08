import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { PRODUCTS_MICROSERVICE } from 'src/config/services';
import { OrdersService } from './orders.service';

import { OrdersController } from './orders.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PRODUCTS_MICROSERVICE,
        imports: [ ConfigModule, ],
        inject: [ ConfigService ],
        useFactory: ( configService: ConfigService ) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('PRODUCTS_MICROSERVICE_HOST'),
            port: configService.getOrThrow<number>('PRODUCTS_MICROSERVICE_NAME')
          }
        })
      }
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
