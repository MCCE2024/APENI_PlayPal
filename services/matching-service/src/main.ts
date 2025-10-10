import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Import this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  

    // Enable CORS

    app.enableCors();


  

    // Add this line to enable global validation

    app.useGlobalPipes(new ValidationPipe());

  

    await app.listen(3005);

  }

  bootstrap();

  