import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('OrdersMicroserviceMain');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: process.env.NATS_SERVERS.split(','),
      }
    }
  );

  await app.listen();

  logger.log(`Orders Microservice running on port ${ process.env.PORT }`)

}
bootstrap();
