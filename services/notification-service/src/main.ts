import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafkaUsername = process.env.KAFKA_USERNAME;
  const kafkaPassword = process.env.KAFKA_PASSWORD;
  const kafkaSslCa = process.env.KAFKA_SSL_CA;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        ssl: kafkaSslCa
          ? {
              ca: [kafkaSslCa],
            }
          : !!kafkaUsername,
        sasl: kafkaUsername
          ? {
              mechanism: 'plain',
              username: kafkaUsername,
              password: kafkaPassword || '',
            }
          : undefined,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
      consumer: {
        groupId: `notification-service-group-${process.env.NODE_ENV || 'dev'}`,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
