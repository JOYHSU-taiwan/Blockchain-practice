import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestFactory exposes a few static methods that allow creating an application instance 
  const app = await NestFactory.create(AppModule);
  // start app with the HTTP server listening on the port defined in src/main.ts
  await app.listen(3000);
  console.log('Application Started');
}
bootstrap();
