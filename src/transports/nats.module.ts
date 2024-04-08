import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { NATS_SERVICE } from 'src/config/services';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: NATS_SERVICE,
                imports: [ ConfigModule ],
                inject: [ ConfigService ],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.NATS,
                    options: {
                        servers: configService.getOrThrow<string>('NATS_SERVERS').split(','),
                    }
                })
            }
        ]),
    ],
    exports: [
        ClientsModule.registerAsync([
            {
                name: NATS_SERVICE,
                imports: [ ConfigModule ],
                inject: [ ConfigService ],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.NATS,
                    options: {
                        servers: configService.getOrThrow<string>('NATS_SERVERS').split(','),
                    }
                })
            }
        ])
    ]
})
export class NatsModule {}
