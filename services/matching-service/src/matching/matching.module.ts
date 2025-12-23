import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import {
  MatchingRequest,
  MatchingRequestSchema,
} from './schemas/matching-request.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchingRequest.name, schema: MatchingRequestSchema },
    ]),
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'matching-service',
              brokers: (
                configService.get<string>('KAFKA_BROKERS') || 'localhost:9092'
              ).split(','),
              ssl: true,
              sasl: {
                mechanism: 'plain',
                username: configService.get<string>('KAFKA_USERNAME') || '',
                password: configService.get<string>('KAFKA_PASSWORD') || '',
              },
            },
            consumer: {
              groupId: 'matching-service-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
