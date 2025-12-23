import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafkaUsername = process.env.KAFKA_USERNAME;
  const kafkaPassword = process.env.KAFKA_PASSWORD;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        ssl: !!kafkaUsername,
        sasl: kafkaUsername
          ? {
              mechanism: 'plain',
              username: kafkaUsername,
              password: kafkaPassword || '',
            }
          : undefined,
      },
      consumer: {
        groupId: 'notification-service-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3006);
}
void bootstrap();
